/**
 * Demandes recueillies par l'assistante.
 *
 * POST /api/lead              enregistre une demande, puis prévient sur Telegram
 * GET  /api/lead?k=<secret>   liste les demandes (secret LEADS_KEY)
 *
 * Le secret se déclare dans le tableau de bord Cloudflare :
 * Settings → Variables and Secrets → LEADS_KEY.
 */

const PREFIX = 'lead:'
const MAX = 400

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

/**
 * Envoie l'alerte Telegram. Demande deux variables dans Cloudflare :
 * TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID. Sans elles on n'envoie rien,
 * la demande reste consultable par `npm run demandes`.
 */
async function prevenirTelegram(env, lead) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chat = env.TELEGRAM_CHAT_ID
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

  // 401 = jeton révoqué, 400 = chat_id erroné : des pannes muettes si on ne les lève pas
  if (!r.ok) throw new Error(`Telegram a répondu ${r.status} : ${(await r.text()).slice(0, 200)}`)
}

export async function onRequestPost({ env, request, waitUntil }) {
  if (!env.VIEWS) return json({ error: 'kv-unbound' }, 503)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'json-invalide' }, 400)
  }

  const clean = (v) => String(v ?? '').trim().slice(0, MAX)
  const lead = {
    nom: clean(body.nom),
    contact: clean(body.contact),
    besoin: clean(body.besoin),
    recu: new Date().toISOString(),
    pays: request.headers.get('cf-ipcountry') || '',
  }

  if (!lead.nom || !lead.contact) return json({ error: 'incomplet' }, 400)

  const key = `${PREFIX}${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  // conservé un an, largement au-delà du délai de réponse utile
  await env.VIEWS.put(key, JSON.stringify(lead), { expirationTtl: 60 * 60 * 24 * 365 })

  // la demande est en sécurité : l'alerte peut partir après la réponse,
  // et un échec Telegram ne doit jamais faire échouer l'enregistrement
  waitUntil(
    prevenirTelegram(env, lead).catch((e) => {
      // le visiteur n'en saura rien, mais la trace existe dans les logs Cloudflare
      // (`npx wrangler pages deployment tail --project-name ouattaratech`)
      console.error('alerte Telegram non partie :', e.message)
    }),
  )

  return json({ ok: true })
}

export async function onRequestGet({ env, request }) {
  const key = new URL(request.url).searchParams.get('k')
  if (!env.LEADS_KEY || key !== env.LEADS_KEY) return json({ error: 'refuse' }, 403)
  if (!env.VIEWS) return json({ error: 'kv-unbound' }, 503)

  const list = await env.VIEWS.list({ prefix: PREFIX, limit: 200 })
  const leads = await Promise.all(
    list.keys.map(async (k) => {
      try {
        return JSON.parse(await env.VIEWS.get(k.name))
      } catch {
        return null
      }
    }),
  )
  return json({ leads: leads.filter(Boolean).reverse() })
}
