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
    for (const ligne of lignes) {
      if (!ligne.startsWith('data:')) continue
      const charge = ligne.slice(5).trim()
      if (!charge || charge === '[DONE]') continue
      try {
        const morceau = JSON.parse(charge)
        if (typeof morceau.response === 'string') texte += morceau.response
      } catch {
        /* fragment incomplet, complété au tour suivant */
      }
    }
  }
  return texte
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
