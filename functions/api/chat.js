import { SYSTEM, profil, vocabulaire } from './_profil'
import { enregistrerDemande, extraireDemande, texteDuFlux } from './_lead'

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
async function capterDemande(flux, env, request) {
  let texte = ''
  try {
    texte = await texteDuFlux(flux)
  } catch (e) {
    console.error('lecture du flux interrompue :', String(e).slice(0, 200))
    return
  }

  const demande = extraireDemande(texte)
  if (!demande) return

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

/** Compteur journalier par adresse IP, pour protéger le quota gratuit. */
async function overQuota(env, request) {
  if (!env.VIEWS) return false
  const ip = request.headers.get('cf-connecting-ip') || 'inconnu'
  const key = `chat:${new Date().toISOString().slice(0, 10)}:${ip}`
  const used = Number(await env.VIEWS.get(key)) || 0
  if (used >= DAILY_LIMIT) return true
  await env.VIEWS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 })
  return false
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

  if (await overQuota(env, request)) {
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

    // une copie pour le visiteur, une pour l'analyse : les deux branches
    // avancent indépendamment, une coupure côté visiteur n'interrompt pas
    // l'enregistrement
    const [versVisiteur, versAnalyse] = stream.tee()
    waitUntil(capterDemande(versAnalyse, env, request))

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
