import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'
import type { Tier } from '../../lib/perf'

const HEIGHT = 9
const RADIUS = 1.5
/** Au-dessous de cette hauteur de canvas, les points sont grossis. */
const REF_HEIGHT_PX = 560

/** Double hélice de données : deux brins de points + traverses lumineuses. */
function Helix({ tier, phase }: { tier: Tier; phase: number }) {
  const low = tier === 'low'
  const group = useRef<THREE.Group>(null!)
  const shape = useRef<THREE.Group>(null!)
  const matA = useRef<THREE.PointsMaterial>(null!)
  const matB = useRef<THREE.PointsMaterial>(null!)
  const fitted = useRef(false)
  const count = low ? 150 : 210

  const { strandA, strandB, rungs } = useMemo(() => {
    const a = new Float32Array(count * 3)
    const b = new Float32Array(count * 3)
    const rungPts: number[] = []
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const y = (t - 0.5) * HEIGHT
      const ang = t * Math.PI * 5.2
      const ax = Math.cos(ang) * RADIUS
      const az = Math.sin(ang) * RADIUS
      a.set([ax, y, az], i * 3)
      b.set([-ax, y, -az], i * 3)
      if (i % 5 === 0) rungPts.push(ax, y, az, -ax, y, -az)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(rungPts, 3))
    return { strandA: a, strandB: b, rungs: g }
  }, [count])

  const geoA = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(strandA, 3))
    return g
  }, [strandA])

  const geoB = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(strandB, 3))
    return g
  }, [strandB])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (!group.current) return

    group.current.rotation.y += d * 0.28
    const t = state.clock.elapsedTime + phase
    group.current.rotation.z = Math.sin(t * 0.2) * 0.1
    group.current.position.y = Math.sin(t * 0.35) * 0.18

    /*
     * L'hélice remplit la hauteur disponible. Sur un canvas court — le cas
     * du mobile — elle s'élargit et ses points grossissent, sinon elle se
     * réduit à un mince ruban à peine lisible.
     * L'échelle non uniforme est appliquée à un groupe interne : la rotation
     * du groupe externe reste ainsi rigide, sans cisaillement.
     */
    if (state.size.height > 1 && shape.current) {
      const boost = THREE.MathUtils.clamp(REF_HEIGHT_PX / state.size.height, 1, 2.1)
      const sy = THREE.MathUtils.clamp((state.viewport.height * 0.76) / HEIGHT, 0.3, 1.6)
      const sxz = sy * THREE.MathUtils.clamp(boost * 0.92, 1, 1.75)

      if (!fitted.current) {
        fitted.current = true
        shape.current.scale.set(sxz, sy, sxz)
      } else {
        shape.current.scale.set(
          THREE.MathUtils.lerp(shape.current.scale.x, sxz, 0.15),
          THREE.MathUtils.lerp(shape.current.scale.y, sy, 0.15),
          THREE.MathUtils.lerp(shape.current.scale.z, sxz, 0.15),
        )
      }

      if (matA.current) matA.current.size = 0.078 * boost
      if (matB.current) matB.current.size = 0.062 * boost
    }
  })

  return (
    <group ref={group} rotation={[0.25, phase, 0.35]}>
      <group ref={shape}>
      <points geometry={geoA}>
        <pointsMaterial
          ref={matA}
          size={0.078}
          color="#f5c451"
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <points geometry={geoB}>
        <pointsMaterial
          ref={matB}
          size={0.062}
          color="#a78bff"
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments geometry={rungs}>
        <lineBasicMaterial
          color="#7d55ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      </group>
    </group>
  )
}

export default function DataHelix({
  className = '',
  phase = 0,
}: {
  className?: string
  /** Décale l'animation pour que deux hélices ne soient pas synchrones. */
  phase?: number
}) {
  return (
    <Scene
      className={className}
      rootMargin="240px"
      camera={{ position: [0, 0, 9], fov: 42 }}
      fallback={null}
    >
      {(tier) => <Helix tier={tier} phase={phase} />}
    </Scene>
  )
}
