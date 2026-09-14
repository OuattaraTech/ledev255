import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AuroraPlane from '../components/three/AuroraPlane'
import { Reveal, SectionHeading, TiltCard } from '../components/primitives'
import { projects, type Project } from '../data/content'

const accentMap = {
  violet: { from: '#5320cc', to: '#9c7dff', text: 'text-violet-300', ring: 'rgba(125,85,255,0.5)' },
  gold: { from: '#b9822a', to: '#ffd98a', text: 'text-gold-300', ring: 'rgba(245,196,81,0.5)' },
  mixed: { from: '#6a35f5', to: '#f5c451', text: 'text-chalk', ring: 'rgba(200,150,255,0.5)' },
}

/** Visuel génératif : pas de capture d'écran, une identité par projet. */
function ProjectVisual({ project, tall = false }: { project: Project; tall?: boolean }) {
  const a = accentMap[project.accent]
  // Sigle explicite si fourni, sinon initiales des mots du titre.
  const words = project.title.split(/\s+/).filter((w) => /[A-Za-zÀ-ÿ]/.test(w))
  const initials = (
    project.monogram ??
    (words.length > 1
      ? words.map((w) => w[0]).join('').slice(0, 3)
      : (words[0] ?? project.title).slice(0, 2))
  ).toUpperCase()

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${
        // Une capture garde toujours son format 16:10 : sur un cadre plus haut,
        // elle serait rognée sur les côtés et perdrait ses bords.
        project.image ? 'aspect-[16/10]' : tall ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-[16/10]'
      }`}
      style={{ background: `linear-gradient(135deg, ${a.from} 0%, #07071a 55%, ${a.to}22 100%)` }}
    >
      {/* Capture réelle si le projet en a une */}
      {project.image && (
        <>
          <img
            src={project.image}
            alt={`Aperçu de ${project.title}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/10" />
        </>
      )}
      {/* grille */}
      <div
        className={`absolute inset-0 ${project.image ? 'opacity-0' : 'opacity-[0.16]'}`}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          maskImage: 'radial-gradient(ellipse at 30% 20%, #000, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 30% 20%, #000, transparent 78%)',
        }}
      />

      {/* halo conique animé */}
      <div
        className={`absolute -right-1/4 -top-1/2 h-[160%] w-[110%] animate-spin-slower blur-xl ${
          project.image ? 'opacity-0' : 'opacity-30'
        }`}
        style={{
          background: `conic-gradient(from 0deg, transparent, ${a.to}, transparent 55%)`,
        }}
      />

      {/* initiales */}
      {!project.image && (
        <span
          className="absolute bottom-[-6%] left-3 font-display text-[26vw] font-bold leading-none tracking-tighter text-white/[0.07] sm:text-[9rem]"
          aria-hidden
        >
          {initials}
        </span>
      )}

      {/* badge année */}
      {project.year && (
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
          {project.year}
        </span>
      )}

      {/* Stack flottante — inutile par-dessus une capture, où elle
          encombre l'écran du produit. Elle reste affichée sous le texte. */}
      <div
        className={`absolute inset-x-4 bottom-4 flex-wrap gap-1.5 ${
          project.image ? 'hidden' : 'flex'
        }`}
      >
        {project.stack.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/12 bg-black/35 px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-white/80 backdrop-blur-sm"
          >
            {s}
          </span>
        ))}
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (project) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <div className="absolute inset-0 bg-void/85 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ y: '8%', opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '6%', opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl glass-strong p-5 sm:rounded-3xl sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-chalk/70 transition-colors hover:border-gold-400/50 hover:text-gold-300"
            >
              ✕
            </button>

            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/20 sm:hidden" />

            <span className="eyebrow">{project.category}</span>
            <h3 className="mt-2 font-display text-2xl font-bold text-chalk sm:text-3xl">
              {project.title}
            </h3>

            <div className="mt-5">
              <ProjectVisual project={project} />
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-muted">{project.description}</p>

            <div className="mt-6">
              <p className="eyebrow">Points clés</p>
              <ul className="mt-3 space-y-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[14px] text-chalk/85">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {project.links.site && (
                <a
                  href={project.links.site}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary flex-1"
                >
                  Site officiel ↗
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex-1 ${project.links.site ? 'btn-ghost' : 'btn-primary'}`}
                >
                  Ouvrir l’application ↗
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ghost flex-1"
                >
                  Code source
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projets" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <AuroraPlane className="pointer-events-none absolute inset-x-0 top-0 h-[60%] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Réalisations"
          title="Projets"
          accent="phares"
          description="Des produits pensés pour le terrain, construits de bout en bout : conception, développement, mise en production."
        />

        {/* Projets phares */}
        <div className="mt-14 space-y-8 sm:mt-20 sm:space-y-14">
          {featured.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <Reveal key={p.id} direction={flip ? 'left' : 'right'} amount={0.15}>
                <article
                  className={`group grid items-center gap-6 lg:grid-cols-2 lg:gap-12 ${
                    flip ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <TiltCard className="rounded-2xl" intensity={8}>
                    <button
                      onClick={() => setSelected(p)}
                      className="block w-full text-left"
                      aria-label={`Ouvrir ${p.title}`}
                      data-cursor="grow"
                    >
                      <ProjectVisual project={p} tall />
                    </button>
                  </TiltCard>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 font-mono text-[11px] text-gold-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px min-w-[1rem] flex-1 bg-gradient-to-r from-gold-400/40 to-transparent" />
                      <span className="min-w-0 text-right font-mono text-[10px] uppercase leading-snug tracking-wide text-muted">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-chalk sm:text-3xl lg:text-4xl">
                      {p.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
                      {p.summary}
                    </p>

                    <ul className="mt-5 space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-[14px] text-chalk/80">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelected(p)}
                      className="group/btn mt-6 inline-flex items-center gap-2 font-display text-sm text-gold-300"
                    >
                      Explorer le projet
                      <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* Autres projets */}
        {others.length > 0 && (
          <>
            <Reveal>
              <div className="mt-16 flex items-center gap-4 sm:mt-24">
                <span className="eyebrow whitespace-nowrap">Aussi dans la boîte à outils</span>
                <span className="hairline" />
              </div>
            </Reveal>

            <div
              className={`mt-6 grid gap-4 sm:gap-5 ${
                others.length >= 3
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : others.length === 2
                    ? 'sm:grid-cols-2'
                    : 'mx-auto w-full max-w-xl'
              }`}
            >
              {others.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <TiltCard className="group h-full rounded-2xl" intensity={6}>
                    <button
                      onClick={() => setSelected(p)}
                      className="grad-border flex h-full w-full flex-col rounded-2xl glass p-5 text-left transition-colors duration-500"
                      data-cursor="grow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="min-w-0 font-mono text-[10px] uppercase leading-snug tracking-wide text-violet-300/80">
                          {p.category}
                        </span>
                        {p.year && (
                          <span className="shrink-0 font-mono text-[10px] text-muted">{p.year}</span>
                        )}
                      </div>
                      <h4 className="mt-3 font-display text-lg font-semibold text-chalk">
                        {p.title}
                      </h4>
                      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                        {p.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.stack.slice(0, 3).map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[13px] text-gold-300">
                        Détails
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </button>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
