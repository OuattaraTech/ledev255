import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { identity } from '../data/content'
import { useReducedMotion } from '../hooks/useMotionPreference'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  /* Retrait garanti par minuterie : l'animation de sortie est pilotée par
     requestAnimationFrame, qui peut ne jamais s'exécuter si l'onglet est en
     arrière-plan. Sans ce garde-fou, le voile resterait affiché. */
  const [gone, setGone] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (visible) return
    const t = setTimeout(() => setGone(true), reduced ? 0 : 1200)
    return () => clearTimeout(t)
  }, [visible, reduced])

  useEffect(() => {
    if (gone) onDone()
  }, [gone, onDone])

  useEffect(() => {
    const started = performance.now()
    const MIN = 1500
    let raf = 0
    let target = 0

    const bump = () => {
      target = Math.min(96, target + Math.random() * 9)
    }
    const iv = setInterval(bump, 130)

    const finish = () => {
      clearInterval(iv)
      target = 100
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    const safety = setTimeout(finish, 4200)
    // filet de sécurité : jamais bloqué, même si rAF est throttlé
    const hardStop = setTimeout(() => setVisible(false), 6500)

    let closing = false
    const tick = () => {
      setProgress((p) => {
        const next = p + (target - p) * 0.12
        if (!closing && next >= 99.4 && performance.now() - started > MIN) {
          closing = true
          setTimeout(() => setVisible(false), 260)
          return 100
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      clearInterval(iv)
      clearTimeout(safety)
      clearTimeout(hardStop)
      cancelAnimationFrame(raf)
      window.removeEventListener('load', finish)
    }
  }, [])

  if (gone) return null

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* rideaux */}
          <motion.div
            className="absolute inset-x-0 top-0 z-10 bg-void"
            initial={{ height: '50%' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 bg-void"
            initial={{ height: '50%' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="relative z-20 flex flex-col items-center gap-7 px-6">
            {/* anneau de chargement */}
            <div className="relative h-24 w-24 sm:h-28 sm:w-28">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(160,150,255,0.13)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#pg)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                />
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffd98a" />
                    <stop offset="55%" stopColor="#f5c451" />
                    <stop offset="100%" stopColor="#7d55ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <img
                  src={identity.logoMark}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-auto sm:h-9"
                />
                <span className="font-mono text-[11px] font-medium text-gold-300 sm:text-xs">
                  {Math.round(progress)}
                </span>
              </div>
              <div className="absolute inset-0 animate-pulse-ring rounded-full border border-violet-500/40" />
            </div>

            <div className="overflow-hidden">
              <motion.p
                className="font-display text-xs uppercase tracking-ultra text-chalk/70 sm:text-sm"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {identity.alias}
              </motion.p>
            </div>

            <motion.p
              className="max-w-xs text-center font-mono text-[10px] uppercase tracking-wider text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {reduced ? 'Chargement…' : 'Initialisation de l’espace 3D…'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
