import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene'
import { skillNodes } from '../../data/content'
import { useHasHover } from '../../hooks/useMediaQuery'
import type { Tier } from '../../lib/perf'

const CAM_Z = 6.4
const LABEL_R = 2.7

/** Répartition de Fibonacci : des points régulièrement espacés sur une sphère. */
function fibonacciSphere(n: number, radius: number) {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius))
  }
  return pts
}

function Label({ text, position }: { text: string; position: THREE.Vector3 }) {
  const anchor = useRef<THREE.Group>(null!)
  const el = useRef<HTMLSpanElement>(null!)
  const world = useRef(new THREE.Vector3())

  // Les étiquettes situées derrière la sphère s'effacent et rétrécissent.
  useFrame(({ camera }) => {
    if (!el.current || !anchor.current) return
    anchor.current.getWorldPosition(world.current)
    const viewZ = world.current.applyMatrix4(camera.matrixWorldInverse).z
    const near = -(CAM_Z - LABEL_R)
    const far = -(CAM_Z + LABEL_R)
    const o = THREE.MathUtils.clamp((viewZ - far) / (near - far), 0, 1)
    el.current.style.opacity = String(0.08 + o * 0.92)
    el.current.style.transform = `scale(${0.68 + o * 0.36})`
  })

  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span
          ref={el}
          className="whitespace-nowrap rounded-full border border-violet-400/25 bg-night/70 px-2 py-[3px] font-mono text-[9px] uppercase tracking-wider text-violet-100 backdrop-blur-sm sm:text-[10px]"
        >
          {text}
        </span>
      </Html>
    </group>
  )
}

function Globe({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const group = useRef<THREE.Group>(null!)
  const radius = 2.35

  const nodes = useMemo(() => fibonacciSphere(skillNodes.length, radius), [radius])

  // arêtes entre nœuds proches → effet réseau neuronal
  const lines = useMemo(() => {
    const positions: number[] = []
    const maxD = radius * 1.02
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxD) {
          positions.push(...nodes[i].toArray(), ...nodes[j].toArray())
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [nodes, radius])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (!group.current) return
    group.current.rotation.y += d * 0.16
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.22
    const px = state.pointer.x
    group.current.rotation.z += (px * 0.12 - group.current.rotation.z) * 0.04
  })

  return (
    <group ref={group}>
      {/* sphère filaire */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.99, low ? 1 : 2]} />
        <meshBasicMaterial
          color="#5320cc"
          wireframe
          transparent
          opacity={0.13}
          depthWrite={false}
        />
      </mesh>

      {/* cœur lumineux */}
      <mesh>
        <sphereGeometry args={[radius * 0.42, 24, 24]} />
        <meshBasicMaterial
          color="#2b0d78"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* connexions */}
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color="#9c7dff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* nœuds */}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[i % 4 === 0 ? 0.062 : 0.042, 0]} />
          <meshBasicMaterial
            color={i % 4 === 0 ? '#f5c451' : '#b9a5ff'}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* étiquettes */}
      {!low && nodes.map((p, i) => (
        <Label key={skillNodes[i]} text={skillNodes[i]} position={p.clone().multiplyScalar(1.14)} />
      ))}
    </group>
  )
}

export default function SkillsGlobe({ className = '' }: { className?: string }) {
  const hasHover = useHasHover()
  return (
    <Scene
      className={className}
      rootMargin="200px"
      inert={!hasHover}
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-40 w-40 animate-spin-slower rounded-full border border-dashed border-violet-400/30" />
        </div>
      }
    >
      {(tier) => (
        <>
          <ambientLight intensity={0.6} />
          <Globe tier={tier} />
        </>
      )}
    </Scene>
  )
}
