import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal, SectionHeading, TiltCard } from '../components/primitives'
import { identity, journey, services } from '../data/content'

function TimelineItem({
  item,
  index,
}: {
  item: (typeof journey)[number]
  index: number
}) {
  const gold = item.accent === 'gold'
  return (
    <Reveal delay={index * 0.08} direction="up" className="relative pl-10 sm:pl-14">
      {/* point */}
      <span
        className={`absolute left-[11px] top-1.5 z-10 grid h-[18px] w-[18px] -translate-x-1/2 place-items-center rounded-full sm:left-[19px] ${
          gold ? 'bg-gold-400' : 'bg-violet-500'
        }`}
        style={{
          boxShadow: gold
            ? '0 0 0 4px rgba(245,196,81,0.14), 0 0 22px rgba(245,196,81,0.55)'
            : '0 0 0 4px rgba(125,85,255,0.14), 0 0 22px rgba(125,85,255,0.55)',
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-void" />
      </span>

      <div className="group relative rounded-2xl glass p-5 transition-all duration-500 hover:border-gold-400/30 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              gold ? 'text-gold-400' : 'text-violet-300'
            }`}
          >
            {item.phase}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted/60" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            {item.place}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-chalk sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted sm:text-[15px]">{item.text}</p>

        <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </Reveal>
  )
}

export default function About() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 75%', 'end 55%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="parcours" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(125,85,255,0.12),transparent_65%)] blur-2xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Le parcours"
          title="L’agronome qui s’est laissé"
          accent="guider par le code"
          description={identity.intro}
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_360px] lg:gap-14">
          {/* Timeline */}
          <div ref={trackRef} className="relative">
            {/* rail */}
            <span className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-[19px]" />
            <motion.span
              className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top sm:left-[19px]"
              style={{
                scaleY,
                background: 'linear-gradient(180deg,#f5c451,#7d55ff)',
                boxShadow: '0 0 14px rgba(125,85,255,0.7)',
              }}
            />
            <motion.span
              className="absolute left-[11px] h-16 w-px -translate-x-1/2 sm:left-[19px]"
              style={{
                top: glowY,
                background: 'linear-gradient(180deg,transparent,#ffe6ad,transparent)',
                filter: 'blur(3px)',
              }}
            />

            <div className="flex flex-col gap-6 sm:gap-8">
              {journey.map((j, i) => (
                <TimelineItem key={j.phase} item={j} index={i} />
              ))}
            </div>
          </div>

          {/* Encadré services */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal direction="left">
              <TiltCard className="group rounded-3xl" intensity={6}>
                <div className="grad-border relative overflow-hidden rounded-3xl glass-strong p-6 sm:p-7">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(245,196,81,0.22),transparent_70%)] blur-xl" />

                  <span className="eyebrow">Ce que je fais</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-chalk sm:text-2xl">
                    Trois façons de <span className="text-gradient">travailler ensemble</span>
                  </h3>

                  <ul className="mt-6 space-y-5">
                    {services.map((s, i) => (
                      <li key={s.title} className="flex gap-3.5">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-gold-400/30 bg-gold-400/10 font-mono text-[10px] text-gold-300">
                          0{i + 1}
                        </span>
                        <div>
                          <p className="font-display text-[15px] font-medium text-chalk">{s.title}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="btn-primary mt-7 w-full">
                    Discutons de votre projet
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
