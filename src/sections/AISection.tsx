import { motion } from 'framer-motion'
import DataHelix from '../components/three/DataHelix'
import { Reveal, SectionHeading, TiltCard } from '../components/primitives'
import { aiMetrics, aiPillars, channel } from '../data/content'
import { WhatsAppIcon } from '../components/icons'

export default function AISection() {
  return (
    <section id="ia" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Hélice de données en fond */}
      {/* Deux brins qui encadrent la section sur grand écran */}
      <DataHelix
        phase={0}
        className="pointer-events-none absolute -right-20 top-1/2 hidden h-[760px] w-[520px] -translate-y-1/2 opacity-70 lg:block"
      />
      <DataHelix
        phase={2.4}
        className="pointer-events-none absolute -left-20 top-1/2 hidden h-[760px] w-[520px] -translate-y-1/2 -scale-x-100 opacity-55 lg:block"
      />
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
        <div className="relative mt-8 h-[360px] sm:h-[440px] lg:hidden">
          <div className="pointer-events-none absolute inset-x-[15%] inset-y-[8%] rounded-full bg-[radial-gradient(ellipse,rgba(125,85,255,0.2),transparent_68%)] blur-2xl" />
          <DataHelix className="pointer-events-none absolute inset-0" />
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {aiPillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.07}
              direction={i % 2 ? 'left' : 'right'}
              // en nombre impair, la dernière carte prend toute la largeur
              // plutôt que de rester seule à côté d'un vide
              className={i === aiPillars.length - 1 && i % 2 === 0 ? 'sm:col-span-2' : ''}
            >
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
                mon-workflow.log
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

        {/* ── Chaîne WhatsApp ── */}
        <Reveal delay={0.1}>
          <div className="grad-border relative mt-8 overflow-hidden rounded-3xl glass-strong sm:mt-10">
            {/* lueur verte, discrète */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.18),transparent_68%)] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(125,85,255,0.16),transparent_68%)] blur-2xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10 lg:p-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#25D366]">
                    <WhatsAppIcon className="h-5 w-5 fill-white" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-ultra text-[#25D366]">
                    {channel.platform}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-chalk sm:text-3xl lg:text-4xl">
                  {channel.name}
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
                  {channel.pitch}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {channel.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] text-chalk/85">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#25D366]" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="grow"
                    className="btn inline-flex w-full items-center justify-center gap-2 whitespace-nowrap bg-[#25D366] text-void
                               shadow-[0_8px_30px_-8px_rgba(37,211,102,0.7)] hover:-translate-y-0.5
                               hover:shadow-[0_12px_40px_-8px_rgba(37,211,102,0.9)] sm:w-auto"
                  >
                    <WhatsAppIcon className="h-[18px] w-[18px] fill-void" />
                    {channel.cta}
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {channel.note}
                  </span>
                </div>
              </div>

              {/* Aperçu des publications */}
              {channel.shots.length > 0 && (
                <div
                  className="mask-fade-x -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2
                             sm:-mx-8 sm:px-8 lg:mx-0 lg:snap-none lg:justify-end lg:overflow-visible lg:px-0"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {channel.shots.map((shot, i) => (
                    <figure
                      key={shot.src}
                      className={`w-[150px] shrink-0 snap-center overflow-hidden rounded-2xl border border-line
                                  bg-night shadow-[0_20px_55px_-20px_rgba(0,0,0,0.95)] sm:w-[165px]
                                  lg:w-[150px] xl:w-[165px] ${
                                    i === 0
                                      ? 'lg:rotate-[-4deg]'
                                      : i === 1
                                        ? 'lg:z-10 lg:-mx-3 lg:scale-105'
                                        : 'lg:rotate-[4deg]'
                                  }`}
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-[260px] w-full object-cover object-top sm:h-[290px]"
                      />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
