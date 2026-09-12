import { useEffect, useState } from 'react'

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)', true)
export const useIsTablet = () => useMediaQuery('(max-width: 1023px)', true)
export const useReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)', false)
export const useHasHover = () => useMediaQuery('(hover: hover) and (pointer: fine)', false)
