import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Scene from './Scene'
import Nebula from './Nebula'
import CoreOrb from './CoreOrb'
import OrbitRings from './OrbitRings'
import Rig from './Rig'
import { particleBudget, type Tier } from '../../lib/perf'

/** Élément DOM sur lequel le cœur 3D vient se caler. */
export const PORTRAIT_ANCHOR_ID = 'portrait-anchor'

const CORE_RADIUS = 1.1
const CAGE_SCALE = 1.42 // extension de la cage filaire autour du cœur
const CORE_VS_BOX = 0.69 // rayon visé, en fraction du demi-côté du portrait
const RING_SCALE = 0.595

/**
 * Le cœur énergétique se cale sur le portrait en lisant sa position réelle
 * dans la page. Aucune hypothèse sur la taille du canvas : ça reste juste
 * sur mobile, sur desktop et à chaque redimensionnement.
 */
function EnergyCore({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const group = useRef<THREE.Group>(null!)
  const rings = useRef<THREE.Group>(null!)
  const target = useRef(new THREE.Vector3())
  const anchor = useRef<{ x: number; y: number; r: number } | null>(null)
  const frame = useRef(0)
  const settled = useRef(false)

  useFrame((state) => {
    if (!group.current) return

    // lecture du DOM espacée : suffisante pour suivre resize et reflow
    if (frame.current++ % 10 === 0) {
      const el = document.getElementById(PORTRAIT_ANCHOR_ID)
      const c = state.gl.domElement.getBoundingClientRect()
      if (el && c.width > 1 && c.height > 1) {
        const a = el.getBoundingClientRect()
        const ndcX = ((a.left + a.width / 2 - c.left) / c.width) * 2 - 1
        const ndcY = -(((a.top + a.height / 2 - c.top) / c.height) * 2 - 1)
        anchor.current = {
          x: (ndcX * state.viewport.width) / 2,
          y: (ndcY * state.viewport.height) / 2,
          r: (a.width / 2) * (state.viewport.height / c.height),
        }
      }
    }

    const a = anchor.current
    if (!a) return

    target.current.set(a.x, a.y, 0)
    const s = (a.r * CORE_VS_BOX) / (CORE_RADIUS * CAGE_SCALE)

    if (!settled.current) {
      settled.current = true
      group.current.position.copy(target.current)
      group.current.scale.setScalar(s)
      rings.current?.scale.setScalar(RING_SCALE)
      return
    }

    group.current.position.lerp(target.current, 0.15)
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.15))
  })

  return (
    <group ref={group} scale={0.001}>
      <CoreOrb
        detail={low ? 8 : tier === 'high' ? 28 : 18}
        radius={CORE_RADIUS}
        amp={low ? 0.22 : 0.3}
      />
      <group ref={rings} scale={RING_SCALE}>
        <OrbitRings segments={low ? 48 : 128} />
      </group>
    </group>
  )
}

function Content({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const high = tier === 'high'

  return (
    <>
      <Rig strength={low ? 0.2 : 0.45} damping={0.028} />
      <ambientLight intensity={0.4} />

      <Nebula
        count={Math.round(particleBudget(tier) * 0.55)}
        radius={low ? 15 : 20}
        size={low ? 5.5 : 5}
        opacity={low ? 0.5 : 0.62}
      />

      <EnergyCore tier={tier} />

      {!low && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={high ? 0.62 : 0.42}
            luminanceThreshold={0.42}
            luminanceSmoothing={0.5}
            mipmapBlur
            radius={0.65}
          />
          <Vignette eskil={false} offset={0.26} darkness={0.82} />
        </EffectComposer>
      )}
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(125,85,255,0.22),transparent_62%)]" />
      }
    >
      {(tier) => <Content tier={tier} />}
    </Scene>
  )
}
