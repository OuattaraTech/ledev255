import { useEffect } from 'react'
import Lenis from 'lenis'
import { VERROU_DEFILEMENT } from '../lib/defilement'
import { useReducedMotion } from '../hooks/useMotionPreference'

/**
 * Immobilise la page.
 *
 * Safari iOS ignore `overflow: hidden` sur les racines : seul un
 * `position: fixed` sur <body> l'arrête vraiment. Le défaut de cette
 * méthode est qu'elle ramène le document en haut — on mémorise donc la
 * position pour la rendre au déverrouillage.
 */
let positionMemorisee = 0

function figerDocument(actif: boolean) {
  const { body, documentElement: racine } = document
  if (actif) {
    positionMemorisee = window.scrollY
    body.style.position = 'fixed'
    body.style.top = `-${positionMemorisee}px`
    body.style.left = '0'
    body.style.right = '0'
    racine.style.overflow = 'hidden'
    return
  }
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  racine.style.overflow = ''
  // `auto` et non `smooth` : le retour doit être instantané, sinon on voit
  // la page remonter depuis le haut au moment où le chat se referme
  window.scrollTo({ top: positionMemorisee, behavior: 'auto' })
}

export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      const onVerrou = (e: Event) => figerDocument((e as CustomEvent<boolean>).detail)
      window.addEventListener(VERROU_DEFILEMENT, onVerrou)
      const hash = window.location.hash.slice(1)
      if (!hash) return () => window.removeEventListener(VERROU_DEFILEMENT, onVerrou)
      const t = window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'auto' })
      }, 350)
      return () => {
        clearTimeout(t)
        window.removeEventListener(VERROU_DEFILEMENT, onVerrou)
      }
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

    // arrêter Lenis ne suffit pas : le défilement natif prendrait le relais
    const onVerrou = (e: Event) => {
      const actif = (e as CustomEvent<boolean>).detail
      if (actif) {
        lenis.stop()
        figerDocument(true)
      } else {
        figerDocument(false)
        lenis.start()
        // Pendant le verrou, le document est passé à 0 : le navigateur a émis
        // un événement de défilement que Lenis a pu enregistrer. On lui
        // réaffirme la vraie position, sinon il la rattrape en douceur à
        // l'écran. `force` parce que l'appel doit passer même à l'arrêt.
        lenis.scrollTo(positionMemorisee, { immediate: true, force: true })
      }
    }
    window.addEventListener(VERROU_DEFILEMENT, onVerrou)

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
      window.removeEventListener(VERROU_DEFILEMENT, onVerrou)
      figerDocument(false)
      document.removeEventListener('click', onAnchor)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
