import { useEffect, useRef } from 'react'
import { useHasHover, useReducedMotion } from '../hooks/useMediaQuery'

/** Curseur personnalisé — desktop uniquement, jamais sur tactile. */
export default function Cursor() {
  const hasHover = useHasHover()
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasHover || reduced) return
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let scale = 1
    let targetScale = 1
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`
      const t = e.target as HTMLElement
      targetScale = t.closest('a,button,[data-cursor="grow"]') ? 2.1 : 1
    }

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      scale += (targetScale - scale) * 0.12
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }

    document.documentElement.style.cursor = 'none'
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [hasHover, reduced])

  if (!hasHover || reduced) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-gold-400/60 mix-blend-difference will-change-transform"
      />
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold-300 will-change-transform"
      />
    </div>
  )
}
