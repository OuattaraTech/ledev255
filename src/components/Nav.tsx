import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import MotionToggle from './MotionToggle'
import { identity, navLinks, socials } from '../data/content'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('accueil')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container-x">
          <nav
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              scrolled ? 'glass-strong shadow-[0_10px_40px_-20px_rgba(125,85,255,0.8)]' : ''
            }`}
          >
            {/* Logo */}
            <a href="#accueil" className="group flex items-center" aria-label={`${identity.alias}, retour en haut`}>
              <img
                src={identity.logo}
                alt={identity.alias}
                width={640}
                height={429}
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.05] sm:h-10"
              />
            </a>

            {/* Liens desktop */}
            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className={`relative block rounded-full px-3.5 py-2 font-display text-[13px] transition-colors duration-300 ${
                      active === l.id ? 'text-void' : 'text-chalk/70 hover:text-chalk'
                    }`}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="hidden rounded-full border border-gold-400/40 px-4 py-2 font-display text-[13px] text-gold-300 transition-all duration-300 hover:bg-gold-400 hover:text-void sm:block"
              >
                Travaillons ensemble
              </a>

              <MotionToggle />

              {/* Burger */}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={open}
                className="relative grid h-10 w-10 place-items-center rounded-xl glass lg:hidden"
              >
                <span className="sr-only">Menu</span>
                <span className="flex h-4 w-5 flex-col justify-between">
                  <motion.span
                    className="block h-[2px] w-full rounded-full bg-chalk"
                    animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block h-[2px] w-full rounded-full bg-chalk"
                    animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="block h-[2px] w-full rounded-full bg-chalk"
                    animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Menu plein écran mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-void/95 backdrop-blur-2xl"
              initial={{ clipPath: 'circle(0% at 90% 5%)' }}
              animate={{ clipPath: 'circle(150% at 90% 5%)' }}
              exit={{ clipPath: 'circle(0% at 90% 5%)' }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            />

            <div className="relative flex h-full flex-col justify-between px-7 pb-10 pt-28 safe-b">
              <ul className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.18 + i * 0.055, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-line/60 py-3.5"
                    >
                      <span className="font-mono text-[10px] text-gold-400/70">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-2xl font-semibold tracking-tight transition-colors sm:text-3xl ${
                          active === l.id ? 'text-gradient' : 'text-chalk'
                        }`}
                      >
                        {l.label}
                      </span>
                      <span className="ml-auto text-gold-400/50 transition-transform duration-300 group-active:translate-x-1">
                        →
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="chip hover:border-gold-400/50 hover:text-gold-300"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {identity.location} · {identity.availability}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
