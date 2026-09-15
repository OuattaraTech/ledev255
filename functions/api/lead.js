/**
 * Demandes recueillies par l'assistante.
 *
 * L'enregistrement se fait désormais dans `chat.js`, qui repère le marqueur
 * dans la réponse qu'il diffuse : une demande ne dépend plus du navigateur
 * du visiteur, qui pouvait fermer son onglet avant de la transmettre.
 *
 * POST /api/lead              enregistre une demande (filet de secours)
 * GET  /api/lead?k=<secret>   liste les demandes (secret LEADS_KEY)
 *
 * Le secret se déclare dans le tableau de bord Cloudflare :
 * Settings → Variables and Secrets → LEADS_KEY.
 */

import { PREFIX, enregistrerDemande } from './_lead'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

export async function onRequestPost({ env, request, waitUntil }) {
  if (!env.VIEWS) return json({ error: 'kv-unbound' }, 503)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'json-invalide' }, 400)
  }

  const ok = await enregistrerDemande(env, request, body, waitUntil)
  return ok ? json({ ok: true }) : json({ error: 'incomplet' }, 400)
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
