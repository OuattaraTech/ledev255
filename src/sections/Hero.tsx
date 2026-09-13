import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import HeroScene from '../components/three/HeroScene'
import { Counter, Magnetic, Marquee } from '../components/primitives'
import { identity, socials, stats } from '../data/content'
import { useReducedMotion } from '../hooks/useMotionPreference'
import { useVisitorCount } from '../hooks/useVisitorCount'

function RotatingRole() {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % identity.roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  if (reduced) {
    return <span className="text-gold-300">{identity.roles[0]}</span>
  }

  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-105%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="whitespace-nowrap text-gold-300"
        >
          {identity.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const visitors = useVisitorCount()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  return (
    <section
      id="accueil"
      ref={ref}
      className="noise relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 sm:pt-28"
    >
      {/* Scène 3D de fond */}
      <HeroScene className="pointer-events-none absolute inset-0 -z-10" />

      {/* Voiles de couleur */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(125,85,255,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-void via-void/80 to-transparent" />

      <motion.div style={{ y, opacity, scale }} className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-10">
          {/* ── Portrait : au-dessus sur mobile, à droite sur desktop ── */}
          <motion.div
            className="order-1 mx-auto w-full max-w-[290px] sm:max-w-[380px] lg:order-2 lg:max-w-[560px]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <img
                src={identity.photoCut}
                alt={`${identity.firstName} ${identity.lastName}, alias ${identity.alias}`}
                width={1200}
                height={1159}
                decoding="async"
                className="mask-portrait h-auto w-full select-none"
              />
            </div>
          </motion.div>

          {/* ── Texte ── */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-chalk/80">
                  {identity.location}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-chalk/80">
                  Disponible
                </span>
              </span>
            </motion.div>

            <h1 className="mt-5 font-display font-bold leading-[0.95] tracking-tight">
              <motion.span
                className="block text-[clamp(2.4rem,11vw,5.5rem)] text-chalk"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {identity.firstName}
              </motion.span>
              <motion.span
                className="block text-[clamp(2.4rem,11vw,5.5rem)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-gradient">{identity.lastName}</span>
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start"
            >
              <span className="font-mono text-xs uppercase tracking-ultra text-violet-300/80 sm:text-sm">
                alias {identity.alias}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-5 font-display text-lg font-medium text-chalk/90 sm:text-xl lg:text-2xl"
            >
              <RotatingRole />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0"
            >
              {identity.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.92 }}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Magnetic>
                <a href="#projets" className="btn-primary w-full sm:w-auto">
                  Voir mes projets
                  <span aria-hidden>↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="btn-ghost w-full sm:w-auto">
                  Me contacter
                </a>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full glass font-mono text-[10px] text-chalk/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-300"
                >
                  {s.short}
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Statistiques ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15 }}
          className={`mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl glass sm:mt-16 ${
            visitors === null ? 'lg:grid-cols-4' : 'lg:grid-cols-5'
          }`}
        >
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center sm:py-6">
              <div className="font-display text-2xl font-bold text-gradient-v sm:text-3xl lg:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted sm:text-[10px]">
                {s.label}
              </div>
            </div>
          ))}

          {/* Compteur en direct : affiché seulement si le serveur répond.
              En ligne sur mobile pour rester lisible, empilé sur grand écran
              pour s'aligner sur les autres chiffres. */}
          {visitors !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-2 flex items-center justify-center gap-2.5 bg-gold-400/[0.08] px-4 py-4
                         sm:gap-3 sm:py-5 lg:col-span-1 lg:flex-col lg:gap-0 lg:bg-gold-400/[0.04] lg:py-6"
            >
              <span className="relative flex h-2 w-2 shrink-0 lg:hidden">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>

              <span className="font-display text-[1.75rem] font-bold leading-none text-gradient sm:text-3xl lg:text-4xl">
                <Counter to={visitors} duration={2.2} />
              </span>

              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-gold-300 sm:text-xs lg:mt-1 lg:text-[10px]">
                <span className="relative hidden h-1.5 w-1.5 lg:flex">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
                </span>
                Visiteurs
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Bandeau défilant */}
      <div className="relative mt-10 border-y border-line/60 py-3 sm:mt-14">
        <Marquee
          items={[
            'Flutter',
            'Dart',
            'Supabase',
            'PostgreSQL',
            'JavaScript',
            'TypeScript',
            'React',
            'Python',
            'TensorFlow Lite',
            'Claude Code',
            'n8n',
            'Cloudflare',
          ]}
        />
      </div>

      {/* Indicateur de scroll */}
      <motion.a
        href="#parcours"
        aria-label="Descendre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mx-auto mt-6 hidden flex-col items-center gap-2 pb-6 sm:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-ultra text-muted">Scroll</span>
        <span className="relative flex h-9 w-[22px] justify-center rounded-full border border-line pt-2">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-gold-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
