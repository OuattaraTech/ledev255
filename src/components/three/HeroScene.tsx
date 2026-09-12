import Scene from './Scene'
import Nebula from './Nebula'
import Rig from './Rig'
import { particleBudget, type Tier } from '../../lib/perf'

/** Fond d'accueil : uniquement un champ d'étoiles en profondeur. */
function Content({ tier }: { tier: Tier }) {
  const low = tier === 'low'

  return (
    <>
      <Rig strength={low ? 0.18 : 0.4} damping={0.028} />
      <Nebula
        count={Math.round(particleBudget(tier) * 0.55)}
        radius={low ? 15 : 20}
        size={low ? 5.5 : 5}
        opacity={low ? 0.5 : 0.62}
      />
    </>
  )
}

export default function HeroScene({ className = '' }: { className?: string }) {
  return (
    <Scene
      className={className}
      once
      rootMargin="0px"
      camera={{ position: [0, 0, 8.2], fov: 46, near: 0.1, far: 90 }}
      fallback={
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(125,85,255,0.16),transparent_62%)]" />
      }
    >
      {(tier) => <Content tier={tier} />}
    </Scene>
  )
}
