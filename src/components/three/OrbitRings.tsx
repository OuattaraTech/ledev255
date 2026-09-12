import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type RingSpec = {
  r: number
  tube: number
  color: string
  opacity: number
  tilt: [number, number, number]
  speed: number
}

const RINGS: RingSpec[] = [
  { r: 2.85, tube: 0.008, color: '#f5c451', opacity: 0.55, tilt: [1.35, 0.35, 0.2], speed: 0.16 },
  { r: 3.35, tube: 0.006, color: '#9c7dff', opacity: 0.4, tilt: [1.05, -0.5, -0.35], speed: -0.11 },
  { r: 4.1, tube: 0.005, color: '#ffe6ad', opacity: 0.22, tilt: [1.5, 0.9, 0.1], speed: 0.07 },
]

function Satellite({
  radius,
  speed,
  offset,
  color,
  size,
  tilt,
}: {
  radius: number
  speed: number
  offset: number
  color: string
  size: number
  tilt: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t) * radius * Math.sin(tilt),
      Math.sin(t) * radius * Math.cos(tilt),
    )
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

export default function OrbitRings({
  segments = 128,
  scale = 1,
}: {
  segments?: number
  scale?: number
}) {
  const group = useRef<THREE.Group>(null!)
  const refs = useRef<THREE.Mesh[]>([])

  const sats = useMemo(
    () => [
      { radius: 2.85, speed: 0.42, offset: 0, color: '#ffd98a', size: 0.045, tilt: 1.35 },
      { radius: 3.35, speed: -0.31, offset: 2.1, color: '#b9a5ff', size: 0.036, tilt: 1.05 },
      { radius: 4.1, speed: 0.22, offset: 4.4, color: '#ffffff', size: 0.028, tilt: 1.5 },
    ],
    [],
  )

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    RINGS.forEach((spec, i) => {
      const m = refs.current[i]
      if (m) m.rotation.z += d * spec.speed
    })
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.25
    }
  })

  return (
    <group ref={group} scale={scale}>
      {RINGS.map((spec, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el
          }}
          rotation={spec.tilt}
        >
          <torusGeometry args={[spec.r, spec.tube, 8, segments]} />
          <meshBasicMaterial
            color={spec.color}
            transparent
            opacity={spec.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      {sats.map((s, i) => (
        <Satellite key={i} {...s} />
      ))}
    </group>
  )
}
