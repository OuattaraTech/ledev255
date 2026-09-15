import { SYSTEM, profil, vocabulaire } from './_profil'
import { enregistrerDemande, extraireDemande, fiabiliser, texteDuFlux } from './_lead'

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
const MAX_MESSAGES = 12 // tours conservés dans l'historique
const MAX_CHARS = 700 // longueur d'une question
// Messages par visiteur et par jour. Calibré sur le plafond de Cloudflare
// (10 000 neurones/jour, soit ~40 à 70 échanges pour tout le site) : à 30,
// deux visiteurs bavards rendaient Kora muette pour tous les autres.
const DAILY_LIMIT = 10

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

/** Enregistre la demande que le modèle a émise, sans dépendre du navigateur. */
async function capterDemande(flux, env, request, ditParLeVisiteur) {
  let texte = ''
  try {
    texte = await texteDuFlux(flux)
  } catch (e) {
    console.error('lecture du flux interrompue :', String(e).slice(0, 200))
    return
  }

  const brut = extraireDemande(texte)
  if (!brut) return

  // le marqueur dit qu'il y a une demande ; les coordonnées, elles, se
  // relisent dans les messages du visiteur
  const demande = fiabiliser(brut, ditParLeVisiteur)
  const ok = await enregistrerDemande(env, request, demande)
  console.log(ok ? `demande enregistrée : ${demande.nom}` : 'demande refusée : incomplète')
}

/**
 * Heure locale du visiteur, déduite du fuseau que Cloudflare attache à la
 * requête. Sans lui, Abidjan : c'est là que sont la plupart des visiteurs.
 */
function heureLocale(request) {
  const zone = request.cf?.timezone || 'Africa/Abidjan'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: zone,
    }).format(new Date())
  } catch {
    return `${new Date().toISOString().slice(11, 16)} UTC`
  }
}

/**
 * Compteur journalier par adresse IP, pour protéger le quota gratuit.
 * La date est dans la clé : chacun repart à zéro à minuit UTC, ce qui est
 * aussi minuit à Abidjan. Les 26 h ne servent qu'à faire le ménage.
 */
const clefDuJour = (request) =>
  `chat:${new Date().toISOString().slice(0, 10)}:${request.headers.get('cf-connecting-ip') || 'inconnu'}`

/** Le visiteur a-t-il déjà eu ses dix réponses aujourd'hui ? Ne décompte rien. */
async function quotaAtteint(env, request) {
  if (!env.VIEWS) return false
  return (Number(await env.VIEWS.get(clefDuJour(request))) || 0) >= DAILY_LIMIT
}

/**
 * Retire un message au visiteur, une fois la réponse acquise.
 *
 * Rien n'est retiré à qui n'en a pas obtenu : un refus de Cloudflare — les
 * neurones du jour épuisés, par exemple — ne doit pas coûter au visiteur un
 * échange qu'il n'a jamais eu.
 */
async function decompter(env, request) {
  if (!env.VIEWS) return
  const key = clefDuJour(request)
  const used = Number(await env.VIEWS.get(key)) || 0
  await env.VIEWS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 })
}

/** Sonde de disponibilité : le site masque l'assistant si elle échoue. */
export async function onRequestGet({ env }) {
  return json({ ok: Boolean(env.AI), model: MODEL })
}

export async function onRequestPost({ env, request, waitUntil }) {
  if (!env.AI) return json({ error: 'ai-unbound' }, 503)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'json-invalide' }, 400)
  }

  const incoming = Array.isArray(body?.messages) ? body.messages : []
  const messages = incoming
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return json({ error: 'message-manquant' }, 400)
  }

  if (await quotaAtteint(env, request)) {
    return json({ error: 'quota' }, 429)
  }

  const { sections, projets } = vocabulaire()
  const system = SYSTEM.replace('__MOMENT__', heureLocale(request))
    .replace('__SECTIONS__', sections)
    .replace('__PROJETS__', projets)
    .replace('__FICHE__', profil())

  try {
    const stream = await env.AI.run(MODEL, {
      messages: [{ role: 'system', content: system }, ...messages],
      max_tokens: 480,
      temperature: 0.3,
      stream: true,
    })

    // le modèle a accepté : c'est seulement maintenant que l'échange se décompte
    waitUntil(decompter(env, request))

    // une copie pour le visiteur, une pour l'analyse : les deux branches
    // avancent indépendamment, une coupure côté visiteur n'interrompt pas
    // l'enregistrement
    const [versVisiteur, versAnalyse] = stream.tee()
    const dits = messages.filter((m) => m.role === 'user').map((m) => m.content)
    waitUntil(capterDemande(versAnalyse, env, request, dits))

    return new Response(versVisiteur, {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
      },
    })
  } catch (e) {
    // Cause la plus probable : les 10 000 neurones/jour du plan gratuit sont
    // épuisés. Le détail reste dans les logs Cloudflare, pas dans la réponse :
    // le visiteur n'a rien à faire d'un message d'erreur technique.
    console.error('appel au modèle en échec :', String(e).slice(0, 300))
    return json({ error: 'modele' }, 502)
  }
}
