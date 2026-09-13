import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { MotionGlobalConfig } from 'framer-motion'
import { useSystemReducedMotion } from './useMediaQuery'

const STORAGE_KEY = 'dev225:motion'

/** 'auto' suit le réglage du système ; les deux autres l'emportent. */
export type MotionPreference = 'auto' | 'reduced' | 'full'

type MotionContext = {
  /** true quand les animations doivent être coupées. */
  reduced: boolean
  preference: MotionPreference
  setPreference: (p: MotionPreference) => void
  toggle: () => void
}

const Ctx = createContext<MotionContext | null>(null)

export function MotionProvider({ children }: { children: ReactNode }) {
  const system = useSystemReducedMotion()
  const [preference, setStored] = useState<MotionPreference>('auto')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'reduced' || saved === 'full') setStored(saved)
    } catch {
      // stockage indisponible : on reste sur le réglage système
    }
  }, [])

  const setPreference = useCallback((p: MotionPreference) => {
    setStored(p)
    try {
      if (p === 'auto') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, p)
    } catch {
      // sans stockage, le choix vaut pour la session
    }
  }, [])

  const reduced = preference === 'auto' ? system : preference === 'reduced'

  useEffect(() => {
    // Une classe sur <html> coupe les animations purement CSS.
    document.documentElement.classList.toggle('reduce-motion', reduced)
    // Et Framer Motion place directement chaque élément à son état final,
    // au lieu de l'y amener image par image.
    MotionGlobalConfig.skipAnimations = reduced
  }, [reduced])

  const toggle = useCallback(() => {
    setPreference(reduced ? 'full' : 'reduced')
  }, [reduced, setPreference])

  const value = useMemo(
    () => ({ reduced, preference, setPreference, toggle }),
    [reduced, preference, setPreference, toggle],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Préférence effective : choix de l'utilisateur, sinon réglage système. */
export function useReducedMotion() {
  const ctx = useContext(Ctx)
  const system = useSystemReducedMotion()
  return ctx ? ctx.reduced : system
}

export function useMotionPreference() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMotionPreference doit être utilisé dans MotionProvider')
  return ctx
}
