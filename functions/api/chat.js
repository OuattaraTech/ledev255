import { SYSTEM, profil, vocabulaire } from './_profil'

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
const MAX_MESSAGES = 12 // tours conservés dans l'historique
const MAX_CHARS = 700 // longueur d'une question
const DAILY_LIMIT = 30 // messages par visiteur et par jour

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

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

export async function onRequestPost({ env, request }) {
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
  const system = SYSTEM.replace('__SECTIONS__', sections)
    .replace('__PROJETS__', projets)
    .replace('__FICHE__', profil())

  try {
    const stream = await env.AI.run(MODEL, {
      messages: [{ role: 'system', content: system }, ...messages],
      max_tokens: 480,
      temperature: 0.3,
      stream: true,
    })

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
      },
    })
  } catch (e) {
    return json({ error: 'modele', detail: String(e).slice(0, 160) }, 502)
  }
}
