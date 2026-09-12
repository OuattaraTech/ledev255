import {
  motion,
  useAnimationFrame,
  useInView as useFmInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useHasHover, useReducedMotion } from '../hooks/useMediaQuery'

/* ───────────────────────── Reveal ───────────────────────── */

const dirOffset = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.75,
  direction = 'up',
  className = '',
  once = true,
  amount = 0.25,
  blur = true,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: keyof typeof dirOffset
  className?: string
  once?: boolean
  amount?: number
  blur?: boolean
}) {
  const reduced = useReducedMotion()
  const off = dirOffset[direction]

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...off, filter: blur ? 'blur(8px)' : 'none' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Texte lettre par lettre ───────────────────────── */

export function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.032,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2'
}) {
  const reduced = useReducedMotion()
  if (reduced) return <Tag className={className}>{text}</Tag>

  const words = text.split(' ')
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const child: Variants = {
    hidden: { opacity: 0, y: '0.55em', rotateX: -70 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      style={{ perspective: 600 }}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch, ci) => (
            <motion.span key={ci} variants={child} className="inline-block will-change-transform">
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}

/* ───────────────────────── Titre de section ───────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  id,
}: {
  eyebrow: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
  id?: string
}) {
  const center = align === 'center'
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <Reveal direction="none">
        <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/70" />
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/70" />
        </div>
      </Reveal>
      <h2
        id={id}
        className="mt-4 font-display text-[clamp(1.9rem,7vw,3.6rem)] font-bold leading-[1.05] tracking-tight"
      >
        <SplitText text={title} />
        {accent && (
          <>
            {' '}
            <span className="text-gradient">
              <SplitText text={accent} delay={0.12} />
            </span>
          </>
        )}
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ───────────────────────── Carte 3D inclinable ───────────────────────── */

export function TiltCard({
  children,
  className = '',
  intensity = 9,
  glare = true,
  style,
}: {
  children: ReactNode
  className?: string
  intensity?: number
  glare?: boolean
  style?: CSSProperties
}) {
  const hasHover = useHasHover()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.4 })
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity])
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity])
  const glareBg = useTransform(
    [sx, sy],
    ([gx, gy]: number[]) =>
      `radial-gradient(420px circle at ${gx * 100}% ${gy * 100}%, rgba(255,225,160,0.14), transparent 62%)`,
  )

  if (!hasHover) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <motion.div
      ref={ref}
      className={`preserve-3d relative ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}

/* ───────────────────────── Bouton magnétique ───────────────────────── */

export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const hasHover = useHasHover()
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })

  if (!hasHover) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Compteur animé ───────────────────────── */

export function Counter({
  to,
  suffix = '',
  duration = 1.6,
  className = '',
}: {
  to: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useFmInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)
  const start = useRef<number | null>(null)
  const reduced = useReducedMotion()

  useAnimationFrame((t) => {
    if (!inView || val >= to) return
    if (reduced) return setVal(to)
    if (start.current === null) start.current = t
    const p = Math.min(1, (t - start.current) / (duration * 1000))
    const eased = 1 - Math.pow(1 - p, 3)
    setVal(Math.round(to * eased))
  })

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

/* ───────────────────────── Barre de compétence ───────────────────────── */

export function SkillBar({ name, level, delay = 0 }: { name: string; level: number; delay?: number }) {
  return (
    <div className="group/bar">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-[13px] font-medium text-chalk/90 sm:text-sm">{name}</span>
        <span className="font-mono text-[10px] text-gold-400/80">{level}%</span>
      </div>
      <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg,#7d55ff,#b9a5ff 55%,#f5c451)',
            boxShadow: '0 0 12px rgba(125,85,255,0.55)',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

/* ───────────────────────── Bandeau défilant ───────────────────────── */

export function Marquee({
  items,
  className = '',
  reverse = false,
}: {
  items: string[]
  className?: string
  reverse?: boolean
}) {
  const doubled = [...items, ...items]
  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee items-center gap-8"
        style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((it, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-sm uppercase tracking-wide2 text-chalk/55 sm:text-base">
              {it}
            </span>
            <span className="h-1 w-1 rounded-full bg-gold-400/70" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── Barre de progression du scroll ───────────────────────── */

export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? h.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${p})`,
          background: 'linear-gradient(90deg,#7d55ff,#b9a5ff 45%,#f5c451)',
          boxShadow: '0 0 14px rgba(245,196,81,0.6)',
        }}
      />
    </div>
  )
}
