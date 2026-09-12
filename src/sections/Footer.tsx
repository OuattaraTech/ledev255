import { identity, navLinks, socials } from '../data/content'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line/70 pt-14">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_50%_120%,rgba(125,85,255,0.22),transparent_65%)]" />

      <div className="container-x relative">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <a href="#accueil" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-violet-600 font-display text-sm font-bold text-void">
                Y
              </span>
              <span className="font-display text-lg font-semibold tracking-wide2">
                LE<span className="text-gold-400">DEV</span>255
              </span>
            </a>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
              {identity.tagline}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted/80">
              {identity.location}
            </p>
          </div>

          <div>
            <p className="eyebrow">Navigation</p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className="text-[14px] text-chalk/70 transition-colors hover:text-gold-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Réseaux</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-[14px] text-chalk/70 transition-colors hover:text-gold-300"
                  >
                    {s.label}
                    <span aria-hidden className="text-[10px]">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Grand nom en filigrane */}
        <div className="relative select-none overflow-hidden" aria-hidden>
          <p className="whitespace-nowrap text-center font-display text-[clamp(3rem,15vw,13rem)] font-bold leading-[0.8] tracking-tighter text-white/[0.035]">
            LE DEV 255
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line/70 py-6 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            © {year} {identity.firstName} {identity.lastName}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Conçu & codé à Abidjan · React · Three.js
          </p>
        </div>
      </div>
    </footer>
  )
}
