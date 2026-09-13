import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'
import { snoise3 } from '../../lib/glsl'
import type { Tier } from '../../lib/perf'

/* ── Planète ────────────────────────────────────────────────────────── */

const planetVert = /* glsl */ `
varying vec3 vNormal;
varying vec3 vLocal;
varying vec3 vView;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vLocal = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const planetFrag = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uRim;
varying vec3 vNormal;
varying vec3 vLocal;
varying vec3 vView;

${snoise3}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);

  // bandes gazeuses, déformées lentement par du bruit
  float warp = snoise(vLocal * 2.1 + vec3(0.0, uTime * 0.05, uTime * 0.02));
  float bands = sin(vLocal.y * 12.0 + warp * 1.05) * 0.5 + 0.5;
  bands = pow(bands, 1.7);

  // éclairage : un seul soleil, en haut à droite
  float lam = clamp(dot(n, normalize(vec3(0.55, 0.45, 0.72))), 0.0, 1.0);

  vec3 col = mix(uDeep, uMid, bands * 0.62);
  col *= 0.16 + lam * 1.05;

  // liseré atmosphérique
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.7);
  col += uRim * fres * (0.35 + lam * 0.75);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── Anneau ─────────────────────────────────────────────────────────── */

const ringVert = /* glsl */ `
varying vec2 vXY;
void main() {
  vXY = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ringFrag = /* glsl */ `
precision mediump float;
uniform float uInner;
uniform float uOuter;
uniform vec3 uGold;
uniform vec3 uViolet;
varying vec2 vXY;

void main() {
  float r = length(vXY);
  float t = (r - uInner) / (uOuter - uInner);
  if (t < 0.0 || t > 1.0) discard;

  // poussière : deux fréquences de bandes
  float wide = 0.5 + 0.5 * sin(t * 44.0);
  float fine = 0.5 + 0.5 * sin(t * 131.0 + 1.7);
  float a = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.7, 1.0, t));
  a *= 0.3 + 0.7 * wide * (0.55 + 0.45 * fine);

  // une division nette, façon Cassini
  a *= 1.0 - 0.9 * exp(-pow((t - 0.5) / 0.045, 2.0));

  vec3 col = mix(uGold, uViolet, t * 0.85);
  gl_FragColor = vec4(col, a * 0.85);
}
`

function Satellite({
  radius,
  speed,
  offset,
  size,
  color,
}: {
  radius: number
  speed: number
  offset: number
  size: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function System({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const group = useRef<THREE.Group>(null!)
  const planet = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const dust = useRef<THREE.Points>(null!)

  const INNER = 1.42
  const OUTER = 2.25

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color('#160a44') },
      uMid: { value: new THREE.Color('#6a35f5') },
      uRim: { value: new THREE.Color('#f5c451') },
    }),
    [],
  )

  const ringUniforms = useMemo(
    () => ({
      uInner: { value: INNER },
      uOuter: { value: OUTER },
      uGold: { value: new THREE.Color('#ffd98a') },
      uViolet: { value: new THREE.Color('#9c7dff') },
    }),
    [],
  )

  // quelques étoiles derrière, pour donner de la profondeur
  const stars = useMemo(() => {
    const n = low ? 60 : 140
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 2.6 + Math.random() * 3.4
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5
      pos[i * 3 + 2] = -1.5 - Math.random() * 4
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [low])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (mat.current) mat.current.uniforms.uTime.value += d
    if (planet.current) planet.current.rotation.y += d * 0.14
    if (dust.current) dust.current.rotation.z += d * 0.012
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.22
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    }
  })

  return (
    <>
      <points ref={dust} geometry={stars}>
        <pointsMaterial
          size={0.035}
          color="#b9a5ff"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={group} rotation={[0.42, 0, 0.24]}>
        {/* la planète est opaque : elle masque la partie d'anneau qui passe derrière */}
        <mesh ref={planet}>
          <sphereGeometry args={[1, low ? 24 : 48, low ? 24 : 48]} />
          <shaderMaterial
            ref={mat}
            vertexShader={planetVert}
            fragmentShader={planetFrag}
            uniforms={planetUniforms}
          />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[INNER, OUTER, low ? 72 : 144, 1]} />
          <shaderMaterial
            vertexShader={ringVert}
            fragmentShader={ringFrag}
            uniforms={ringUniforms}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <Satellite radius={2.62} speed={0.34} offset={0} size={0.045} color="#f5c451" />
        {!low && (
          <Satellite radius={3.05} speed={-0.22} offset={2.3} size={0.032} color="#d6cbff" />
        )}
      </group>
    </>
  )
}

export default function OrbitPlanet({ className = '' }: { className?: string }) {
  return (
    <Scene
      className={className}
      rootMargin="150px"
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      fallback={null}
    >
      {(tier) => <System tier={tier} />}
    </Scene>
  )
}
