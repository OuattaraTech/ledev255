import { motion } from 'framer-motion'
import DataHelix from '../components/three/DataHelix'
import { Reveal, SectionHeading, TiltCard } from '../components/primitives'
import { aiMetrics, aiPillars } from '../data/content'

export default function AISection() {
  return (
    <section id="ia" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Hélice de données en fond */}
      <DataHelix className="pointer-events-none absolute -right-24 top-1/2 hidden h-[720px] w-[520px] -translate-y-1/2 opacity-70 lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(245,196,81,0.1),transparent_65%)] blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Productivité augmentée"
          title="L’IA comme"
          accent="multiplicateur"
          description="Je ne me contente pas d’utiliser des outils IA : je les intègre dans une chaîne de production. Résultat concret — plus de vitesse d’exécution, sans jamais sacrifier la qualité du code livré."
        />

        {/* Hélice visible sur mobile, sous le titre */}
        <div className="relative mt-10 h-56 lg:hidden">
          <DataHelix className="pointer-events-none absolute inset-0" />
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {aiPillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} direction={i % 2 ? 'left' : 'right'}>
              <TiltCard className="group h-full rounded-3xl" intensity={7}>
                <div className="grad-border relative h-full overflow-hidden rounded-3xl glass p-6 transition-colors duration-500 sm:p-7">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(125,85,255,0.28),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/20 to-violet-600/20 font-display text-lg text-gold-300">
                      {p.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-chalk sm:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                        {p.text}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tools.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Gains mesurés */}
        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-3xl glass-strong sm:mt-10">
            <div className="flex items-center gap-3 border-b border-line px-6 py-4">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                gains-mesures.log
              </span>
            </div>

            <div className="divide-y divide-line/70">
              {aiMetrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4"
                >
                  <span className="font-mono text-[11px] text-violet-300/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[14px] text-chalk sm:text-[15px]">{m.label}</span>
                  <span className="ml-auto flex items-center gap-2.5 font-mono text-[11px] sm:text-xs">
                    <span className="text-muted line-through decoration-red-400/50">{m.before}</span>
                    <span className="text-gold-400">→</span>
                    <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                      {m.after}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
