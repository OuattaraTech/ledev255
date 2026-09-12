import { useEffect, useState } from 'react'

const VISIT_KEY = 'ledev255:last-visit'
const WINDOW_MS = 24 * 60 * 60 * 1000

/**
 * Nombre de visiteurs du site, servi par /api/views.
 *
 * Un même navigateur n'est compté qu'une fois par tranche de 24 h : la
 * métrique reste parlante et le nombre d'écritures KV reste bas.
 * Renvoie null tant que la valeur n'est pas connue, ou si la route n'est
 * pas disponible — en développement local, par exemple.
 */
export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const now = Date.now()
    let alreadyCounted = false

    try {
      const last = Number(localStorage.getItem(VISIT_KEY)) || 0
      alreadyCounted = now - last < WINDOW_MS
      if (!alreadyCounted) localStorage.setItem(VISIT_KEY, String(now))
    } catch {
      // navigation privée ou stockage bloqué : on compte la visite
    }

    fetch('/api/views', {
      method: alreadyCounted ? 'GET' : 'POST',
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.count === 'number') setCount(data.count)
      })
      .catch(() => {
        // route absente ou hors ligne : le compteur reste masqué
      })

    return () => controller.abort()
  }, [])

  return count
}
