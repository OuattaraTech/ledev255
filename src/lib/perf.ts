/** Détection très légère du "budget graphique" de l'appareil. */
export type Tier = 'low' | 'mid' | 'high'

let cached: Tier | null = null

export function deviceTier(): Tier {
  if (cached) return cached
  if (typeof window === 'undefined') return 'mid'

  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean; effectiveType?: string }
  }

  const mem = nav.deviceMemory ?? 4
  const cores = nav.hardwareConcurrency ?? 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 768
  const saveData = nav.connection?.saveData === true
  const slowNet = /2g/.test(nav.connection?.effectiveType ?? '')

  let score = 0
  score += mem >= 8 ? 2 : mem >= 4 ? 1 : 0
  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0
  score += narrow ? 0 : 1
  score += coarse ? 0 : 1

  if (saveData || slowNet) return (cached = 'low')
  cached = score >= 5 ? 'high' : score >= 3 ? 'mid' : 'low'
  return cached
}

export function webglAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/** DPR maximal selon le tier — évite de brûler les GPU mobiles. */
export function maxDpr(tier: Tier): [number, number] {
  if (tier === 'low') return [1, 1.25]
  if (tier === 'mid') return [1, 1.6]
  return [1, 2]
}

export const particleBudget = (tier: Tier) =>
  tier === 'low' ? 1400 : tier === 'mid' ? 3200 : 6000
