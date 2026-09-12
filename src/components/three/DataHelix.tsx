import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'
import type { Tier } from '../../lib/perf'

/** Double hélice de données : deux brins de points + traverses lumineuses. */
function Helix({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const group = useRef<THREE.Group>(null!)
  const count = low ? 90 : 190
  const height = 9
  const radius = 1.5

  const { strandA, strandB, rungs } = useMemo(() => {
    const a = new Float32Array(count * 3)
    const b = new Float32Array(count * 3)
    const rungPts: number[] = []
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const y = (t - 0.5) * height
      const ang = t * Math.PI * 5.2
      const ax = Math.cos(ang) * radius
      const az = Math.sin(ang) * radius
      a.set([ax, y, az], i * 3)
      b.set([-ax, y, -az], i * 3)
      if (i % (low ? 8 : 5) === 0) rungPts.push(ax, y, az, -ax, y, -az)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(rungPts, 3))
    return { strandA: a, strandB: b, rungs: g }
  }, [count, low])

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
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.25
  })

  return (
    <group ref={group} rotation={[0.25, 0, 0.35]}>
      <points geometry={geoA}>
        <pointsMaterial
          size={0.075}
          color="#f5c451"
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <points geometry={geoB}>
        <pointsMaterial
          size={0.06}
          color="#9c7dff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments geometry={rungs}>
        <lineBasicMaterial
          color="#6a35f5"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

export default function DataHelix({ className = '' }: { className?: string }) {
  return (
    <Scene
      className={className}
      rootMargin="240px"
      camera={{ position: [0, 0, 9], fov: 42 }}
      fallback={null}
    >
      {(tier) => <Helix tier={tier} />}
    </Scene>
  )
}
