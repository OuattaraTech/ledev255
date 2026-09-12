/**
 * Compteur de visiteurs — Cloudflare Pages Function.
 *
 * GET  /api/views  → lit le compteur
 * POST /api/views  → incrémente puis renvoie la nouvelle valeur
 *
 * Nécessite un namespace KV lié au projet Pages sous le nom VIEWS.
 * Sans cette liaison, la route répond 503 et le compteur disparaît
 * simplement du site : rien ne casse.
 */

const KEY = 'total'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })

export async function onRequestGet({ env }) {
  if (!env.VIEWS) return json({ error: 'kv-unbound' }, 503)
  const raw = await env.VIEWS.get(KEY)
  return json({ count: Number(raw) || 0 })
}

export async function onRequestPost({ env }) {
  if (!env.VIEWS) return json({ error: 'kv-unbound' }, 503)
  const raw = await env.VIEWS.get(KEY)
  const count = (Number(raw) || 0) + 1
  await env.VIEWS.put(KEY, String(count))
  return json({ count })
}
