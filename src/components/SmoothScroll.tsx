import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../hooks/useMotionPreference'

export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      const hash = window.location.hash.slice(1)
      if (!hash) return
      const t = window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'auto' })
      }, 350)
      return () => clearTimeout(t)
    }
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onAnchor = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]')
      if (!target) return
      const id = target.getAttribute('href')!.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -70, duration: 1.2 })
    }
    document.addEventListener('click', onAnchor)

    // lien profond : /#projets doit atterrir au bon endroit après le montage
    const hash = window.location.hash.slice(1)
    let deep = 0
    if (hash) {
      deep = window.setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) lenis.scrollTo(el, { offset: -70, immediate: true })
      }, 350)
    }

    return () => {
      clearTimeout(deep)
      document.removeEventListener('click', onAnchor)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
