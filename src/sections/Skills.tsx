import { motion } from 'framer-motion'
import { useState } from 'react'
import SkillsGlobe from '../components/three/SkillsGlobe'
import { Reveal, SectionHeading, SkillBar } from '../components/primitives'
import { skills } from '../data/content'

export default function Skills() {
  const [active, setActive] = useState(skills[0].key)
  const group = skills.find((s) => s.key === active) ?? skills[0]

  return (
    <section id="competences" className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(11,11,36,0.6),transparent)]" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Stack technique"
          title="Compétences"
          accent="fullstack"
          align="center"
          description="Je couvre toute la chaîne : l’interface que vos utilisateurs touchent, l’API qui la nourrit, la base qui la garde, et le pipeline qui la déploie."
        />

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-14">
          {/* Globe 3D */}
          <Reveal direction="right" className="order-2 min-w-0 lg:order-1">
            <div className="relative mx-auto aspect-square w-full max-w-[580px]">
              <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgba(125,85,255,0.2),transparent_66%)] blur-2xl" />
              <SkillsGlobe className="absolute inset-0" />
              <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-muted">
                22 technologies · en rotation permanente
              </p>
            </div>
          </Reveal>

          {/* Onglets + barres */}
          <div className="order-1 min-w-0 lg:order-2">
            <Reveal direction="left">
              <div
                className="mask-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                style={{ scrollbarWidth: 'none' }}
                role="tablist"
                aria-label="Catégories de compétences"
              >
                {skills.map((s) => (
                  <button
                    key={s.key}
                    role="tab"
                    aria-selected={active === s.key}
                    onClick={() => setActive(s.key)}
                    className={`relative shrink-0 rounded-full px-4 py-2 font-display text-[13px] transition-colors duration-300 ${
                      active === s.key ? 'text-void' : 'text-chalk/70 hover:text-chalk'
                    }`}
                  >
                    {active === s.key && (
                      <motion.span
                        layoutId="skill-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      />
                    )}
                    <span className="relative">{s.title}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 rounded-3xl glass p-6 sm:p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-gold-400/80">
                {group.subtitle}
              </p>
              <div className="mt-6 space-y-5">
                {group.items.map((it, i) => (
                  <SkillBar key={it.name} name={it.name} level={it.level} delay={i * 0.06} />
                ))}
              </div>
            </motion.div>

            <Reveal delay={0.15}>
              <p className="mt-5 text-[13px] leading-relaxed text-muted">
                <span className="text-gold-300">Autodidacte assumé.</span> Chaque ligne de ce
                portfolio, chaque shader et chaque animation vient de la même méthode : lire la doc,
                casser des choses, recommencer jusqu’à ce que ce soit propre.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
