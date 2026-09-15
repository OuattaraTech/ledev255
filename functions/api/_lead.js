/**
 * Enregistrement d'une demande, et alerte Telegram.
 *
 * Partagé par deux appelants : `chat.js`, qui repère le marqueur dans la
 * réponse qu'il diffuse, et `lead.js`, qui expose la route publique.
 */

export const PREFIX = 'lead:'
const MAX = 400

const LEAD = /\[\[LEAD:([^\]]*)\]\]/

/**
 * Recompose le texte d'une réponse à partir du flux d'événements du modèle.
 * Les fragments arrivent découpés n'importe où, y compris au milieu d'une
 * ligne : on ne traite que les lignes complètes et on garde le reste.
 */
export async function texteDuFlux(flux) {
  const lecteur = flux.getReader()
  const decodeur = new TextDecoder()
  let reste = ''
  let texte = ''

  for (;;) {
    const { done, value } = await lecteur.read()
    if (done) break
    reste += decodeur.decode(value, { stream: true })
    const lignes = reste.split('\n')
    reste = lignes.pop() ?? ''
    for (const ligne of lignes) ajouter(ligne)
  }
  // la dernière ligne n'est pas toujours suivie d'un retour : sans elle,
  // un marqueur émis en toute fin de réponse serait perdu
  ajouter(reste)
  return texte

  function ajouter(ligne) {
    if (!ligne.startsWith('data:')) return
    const charge = ligne.slice(5).trim()
    if (!charge || charge === '[DONE]') return
    try {
      const morceau = JSON.parse(charge)
      if (typeof morceau.response === 'string') texte += morceau.response
    } catch {
      /* fragment incomplet, complété au tour suivant */
    }
  }
}

/** Adresse électronique, telle qu'un visiteur l'écrit dans une phrase. */
const EMAIL = /[^\s;,<>()«»"]+@[^\s;,<>()«»"]+\.[a-z]{2,}/gi
/** Numéro de téléphone : huit chiffres au moins, écrits avec ou sans séparateurs. */
const TEL = /\+?\d[\d\s.\-]{6,}\d/g

/** Marqueurs de besoin vide que le modèle produit quand il n'a rien demandé. */
const SANS_OBJET =
  /^(?:le\s+)?(?:projet|besoin)?\s*(?:non\s+(?:sp[ée]cifi[ée]|pr[ée]cis[ée]|renseign[ée]|communiqu[ée])|[àa]\s+pr[ée]ciser|inconnu|non\s+d[ée]fini)\.?$/i

const chiffres = (v) => v.replace(/\D/g, '')

/**
 * Rétablit le contact d'après les mots du visiteur.
 *
 * Le modèle recopie mal les longues suites de chiffres : il lui arrive de
 * n'en garder que le début (« 075 » pour « 0754327898 »). Le visiteur, lui,
 * a écrit son numéro en entier. On ne remplace que si l'un prolonge l'autre :
 * un numéro sans rapport reste celui qu'a désigné le modèle.
 */
function corrigerContact(contact, dit) {
  if (contact.includes('@')) {
    const attendu = contact.toLowerCase()
    for (const trouve of dit.match(EMAIL) ?? []) {
      if (trouve.length > contact.length && trouve.toLowerCase().startsWith(attendu)) return trouve
    }
    return contact
  }

  const attendu = chiffres(contact)
  if (attendu.length < 2) return contact
  for (const trouve of dit.match(TEL) ?? []) {
    const n = chiffres(trouve)
    if (n.length > attendu.length && (n.startsWith(attendu) || n.endsWith(attendu))) {
      return trouve.trim()
    }
  }
  return contact
}

/**
 * Les mots par lesquels le visiteur a ouvert, à défaut d'un besoin.
 * C'est presque toujours là qu'il dit ce qu'il veut ; « bonjour » et les
 * messages qui ne portent que des coordonnées ne comptent pas.
 */
function motsDuVisiteur(messages) {
  const substance = (m) => m.replace(EMAIL, ' ').replace(TEL, ' ').replace(/\s+/g, ' ').trim()
  return (
    messages
      .map((m) => String(m).trim().replace(/\s+/g, ' '))
      .find((m) => substance(m).length > 12) ?? ''
  )
}

/**
 * Confronte la demande à ce que le visiteur a réellement écrit.
 * Le marqueur déclenche l'enregistrement ; les coordonnées, elles, ne
 * dépendent plus de la recopie du modèle.
 */
export function fiabiliser(demande, messages = []) {
  const dit = messages.join('\n')
  if (!dit) return demande

  const contact = corrigerContact(demande.contact, dit)
  const vide = !demande.besoin || SANS_OBJET.test(demande.besoin)
  // plutôt qu'un « projet non spécifié » qui n'apprend rien à Yaya, ses mots à lui
  const besoin = vide ? motsDuVisiteur(messages) : demande.besoin

  return { ...demande, contact, besoin }
}

/** Lit le marqueur de demande dans une réponse. Rend null s'il est absent ou inexploitable. */
export function extraireDemande(texte) {
  const trouve = LEAD.exec(texte)
  if (!trouve) return null

  const [nom = '', contact = '', ...details] = trouve[1].split(';').map((v) => v.trim())
  if (!nom || !contact) {
    // le modèle a émis un marqueur mal formé : mieux vaut le savoir
    console.error('marqueur de demande inexploitable :', trouve[1].slice(0, 120))
    return null
  }
  return { nom, contact, besoin: details.join(' ; ') }
}

/**
 * Envoie l'alerte Telegram. Demande deux variables dans Cloudflare :
 * TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID. Sans elles on n'envoie rien,
 * la demande reste consultable par `npm run demandes`.
 */
async function prevenirTelegram(env, lead) {
  // un secret collé à la main arrive souvent avec une espace ou un retour à la ligne
  const token = String(env.TELEGRAM_BOT_TOKEN ?? '').trim()
  const chat = String(env.TELEGRAM_CHAT_ID ?? '').trim()
  if (!token || !chat) return

  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const date = new Date(lead.recu).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })

  const lignes = [
    '💬 <b>Nouvelle demande</b>',
    '',
    `<b>${esc(lead.nom)}</b>`,
    esc(lead.contact) + (lead.pays ? `  ·  ${esc(lead.pays)}` : ''),
  ]
  if (lead.besoin) lignes.push('', esc(lead.besoin))
  lignes.push('', date)

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat,
      text: lignes.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!r.ok) {
    // l'identifiant qui précède les deux-points désigne le bot ; il n'a rien de secret
    const bot = token.split(':')[0]
    throw new Error(
      `Telegram a répondu ${r.status} (bot ${bot}, jeton de ${token.length} caractères) : ` +
        (await r.text()).slice(0, 200),
    )
  }
}

/**
 * Écrit la demande puis alerte. Rend `false` si elle est incomplète.
 * L'alerte part après la réponse : la demande est déjà en sécurité, et
 * un échec Telegram ne doit jamais faire échouer l'enregistrement.
 */
export async function enregistrerDemande(env, request, brut, waitUntil) {
  if (!env.VIEWS) return false

  const clean = (v) => String(v ?? '').trim().slice(0, MAX)
  const lead = {
    nom: clean(brut.nom),
    contact: clean(brut.contact),
    besoin: clean(brut.besoin),
    recu: new Date().toISOString(),
    pays: request.headers.get('cf-ipcountry') || '',
  }
  if (!lead.nom || !lead.contact) return false

  const key = `${PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  // conservé un an, largement au-delà du délai de réponse utile
  await env.VIEWS.put(key, JSON.stringify(lead), { expirationTtl: 60 * 60 * 24 * 365 })

  const alerte = prevenirTelegram(env, lead).catch((e) => {
    // le visiteur n'en saura rien, mais la trace existe dans les logs Cloudflare
    // (`npx wrangler pages deployment tail --project-name ouattaratech`)
    console.error('alerte Telegram non partie :', e.message)
  })
  if (waitUntil) waitUntil(alerte)
  else await alerte

  return true
}
