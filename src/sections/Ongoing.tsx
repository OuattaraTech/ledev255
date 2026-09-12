import { motion } from 'framer-motion'
import { Reveal, SectionHeading } from '../components/primitives'
import { ongoing } from '../data/content'

const statusStyle: Record<string, string> = {
  'En développement': 'text-violet-300 border-violet-400/35 bg-violet-500/10',
  'Bêta privée': 'text-gold-300 border-gold-400/35 bg-gold-400/10',
  Conception: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
}

export default function Ongoing() {
  return (
    <section id="encours" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(125,85,255,0.13),transparent_65%)] blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Laboratoire"
          title="Projets"
          accent="en cours"
          description="Ce qui sort de l’atelier en ce moment. Ces produits évoluent chaque semaine — les pourcentages bougent, les idées aussi."
        />

        <div
          className={`mt-14 grid gap-4 sm:mt-18 sm:gap-5 ${
            ongoing.length >= 3 ? 'lg:grid-cols-3' : 'sm:grid-cols-2'
          }`}
        >
          {ongoing.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.1}>
              <article className="grad-border group relative flex h-full flex-col overflow-hidden rounded-3xl glass p-6 sm:p-7">
                {/* trame animée */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 11px)',
                  }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${
                      statusStyle[o.status] ?? 'text-chalk/70 border-line'
                    }`}
                  >
                    {o.status}
                  </span>
                  {o.eta && (
                    <span className="font-mono text-[10px] text-muted">ETA {o.eta}</span>
                  )}
                </div>

                <h3 className="relative mt-5 font-display text-xl font-semibold leading-snug text-chalk">
                  {o.title}
                </h3>
                <p className="relative mt-3 flex-1 text-[14px] leading-relaxed text-muted">
                  {o.text}
                </p>

                <div className="relative mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      Avancement
                    </span>
                    <span className="font-display text-lg font-semibold text-gradient-v">
                      {o.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      className="relative h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg,#7d55ff,#b9a5ff 60%,#f5c451)',
                        boxShadow: '0 0 14px rgba(125,85,255,0.6)',
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${o.progress}%` }}
                      viewport={{ once: true, amount: 0.7 }}
                      transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {o.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>

                <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(245,196,81,0.2),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
