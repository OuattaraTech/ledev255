import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene'
import { skillNodes } from '../../data/content'
import { useHasHover } from '../../hooks/useMediaQuery'
import type { Tier } from '../../lib/perf'

const RADIUS = 2.35
const LABEL_RING = 1.11 // les étiquettes se posent juste au-delà des nœuds
const LABEL_MARGIN_PX = 44 // demi-largeur d'une étiquette + un peu d'air
const LABEL_RING_RATIO = 0.8 // l'anneau d'étiquettes occupe 80 % du demi-cadre

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
  const camDir = useRef(new THREE.Vector3())
  const shown = useRef(true)

  /**
   * Seule la moitié avant de la sphère est étiquetée : sinon les noms se
   * chevauchent, surtout sur un écran de téléphone. Le test se fait sur
   * l'orientation du nœud face à la caméra, donc il reste juste quelle que
   * soit l'échelle appliquée au globe.
   */
  useFrame(({ camera }) => {
    if (!el.current || !anchor.current) return

    anchor.current.getWorldPosition(world.current)
    if (world.current.lengthSq() < 1e-6) return
    world.current.normalize()
    camDir.current.copy(camera.position).normalize()

    const facing = world.current.dot(camDir.current)
    const o = THREE.MathUtils.smoothstep(facing, 0.12, 0.52)

    const visible = o > 0.02
    if (visible !== shown.current) {
      shown.current = visible
      el.current.style.visibility = visible ? 'visible' : 'hidden'
    }
    if (!visible) return

    el.current.style.opacity = String(o)
    el.current.style.transform = `scale(${0.82 + o * 0.2})`
  })

  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span
          ref={el}
          className="whitespace-nowrap rounded-full border border-violet-400/30 bg-night/85 px-1.5 py-[2px] font-mono text-[8.5px] uppercase tracking-wider text-violet-100 sm:px-2 sm:py-[3px] sm:text-[10px]"
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
  const fit = useRef<THREE.Group>(null!)

  const nodes = useMemo(() => fibonacciSphere(skillNodes.length, RADIUS), [])

  // arêtes entre nœuds proches → effet réseau neuronal
  const lines = useMemo(() => {
    const positions: number[] = []
    const maxD = RADIUS * 1.02
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
  }, [nodes])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (!group.current) return

    group.current.rotation.y += d * 0.16
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.22
    group.current.rotation.z += (state.pointer.x * 0.12 - group.current.rotation.z) * 0.04

    // Le globe rétrécit juste assez pour que les étiquettes tiennent
    // dans le cadre, quelle que soit la largeur de l'écran.
    if (fit.current && state.size.height > 0) {
      const halfPx = Math.min(state.size.width, state.size.height) / 2
      const worldPerPx = state.viewport.height / state.size.height
      const usablePx = Math.max(
        Math.min(halfPx * LABEL_RING_RATIO, halfPx - LABEL_MARGIN_PX),
        halfPx * 0.35,
      )
      const usable = usablePx * worldPerPx
      const s = THREE.MathUtils.clamp(usable / (RADIUS * LABEL_RING), 0.35, 1.6)
      fit.current.scale.setScalar(
        fit.current.scale.x === 1 ? s : THREE.MathUtils.lerp(fit.current.scale.x, s, 0.2),
      )
    }
  })

  return (
    <group ref={group}>
      <group ref={fit}>
        {/* sphère filaire */}
        <mesh>
          <icosahedronGeometry args={[RADIUS * 0.99, low ? 1 : 2]} />
          <meshBasicMaterial color="#5320cc" wireframe transparent opacity={0.13} depthWrite={false} />
        </mesh>

        {/* cœur lumineux */}
        <mesh>
          <sphereGeometry args={[RADIUS * 0.42, 24, 24]} />
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
            <meshBasicMaterial color={i % 4 === 0 ? '#f5c451' : '#b9a5ff'} toneMapped={false} />
          </mesh>
        ))}

        {/* étiquettes — affichées sur tous les appareils */}
        {nodes.map((p, i) => (
          <Label key={skillNodes[i]} text={skillNodes[i]} position={p.clone().multiplyScalar(LABEL_RING)} />
        ))}
      </group>
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
