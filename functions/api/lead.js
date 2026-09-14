/**
 * Demandes recueillies par l'assistante.
 *
 * POST /api/lead              enregistre une demande
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

export async function onRequestPost({ env, request }) {
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
