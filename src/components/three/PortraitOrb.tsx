import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Scene from './Scene'
import { identity } from '../../data/content'
import type { Tier } from '../../lib/perf'

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform float uTime;
uniform float uHover;
uniform float uReveal;
uniform vec2  uFocus;
uniform float uZoom;
uniform vec3  uViolet;
uniform vec3  uGold;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  vec2 c = uv - 0.5;
  float d = length(c) * 2.0;

  // cadrage : zoom sur le visage
  vec2 suv = (uv - uFocus) / uZoom + 0.5;

  // renflement sphérique léger — donne du volume au disque
  vec2 sc = suv - 0.5;
  suv = sc * (1.0 - 0.07 * (1.0 - d * d) * (1.0 + uHover * 0.6)) + 0.5;

  // ondulation liquide au survol
  suv += vec2(
    sin(uv.y * 20.0 + uTime * 1.5),
    cos(uv.x * 17.0 - uTime * 1.2)
  ) * 0.0035 * uHover;

  // aberration chromatique qui s'ouvre vers le bord
  vec2 dir = c / max(length(c), 0.0001);
  float ab = (0.0015 + uHover * 0.005) * smoothstep(0.15, 1.0, d);
  vec3 col = vec3(
    texture2D(uTex, suv + dir * ab).r,
    texture2D(uTex, suv).g,
    texture2D(uTex, suv - dir * ab).b
  );

  // étalonnage : violet dans les ombres, or dans les hautes lumières
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, col * vec3(0.74, 0.64, 1.28), smoothstep(0.42, 0.0, lum) * 0.6);
  col = mix(col, col * vec3(1.16, 1.04, 0.80), smoothstep(0.62, 1.0, lum) * 0.4);
  col *= 1.06;

  // balayage holographique vertical
  float sweepPos = fract(uTime * 0.085) * 2.4 - 0.7;
  float sweep = 1.0 - smoothstep(0.0, 0.085, abs((1.0 - uv.y) - sweepPos));
  col += uGold * sweep * 0.18;

  // scanlines fines
  col *= 1.0 - 0.05 * step(0.5, fract(uv.y * 260.0));

  // grain
  col += (hash(uv * 900.0 + uTime) - 0.5) * 0.022;

  // anneau lumineux + halo interne
  float rim = smoothstep(0.68, 1.0, d);
  vec3 rimCol = mix(uViolet, uGold, 0.5 + 0.5 * sin(uTime * 0.45 + d * 3.0));
  col += rimCol * rim * (0.45 + uHover * 0.3);

  // vignette interne
  col *= 1.0 - smoothstep(0.55, 1.05, d) * 0.35;

  // révélation radiale avec front bruité
  float noiseFront = hash(floor(uv * 90.0)) * 0.09;
  float rev = 1.0 - smoothstep(uReveal - 0.14, uReveal + noiseFront, d);
  float edge = 1.0 - smoothstep(0.975, 1.0, d);

  // liseré incandescent sur le front de révélation
  float front = smoothstep(0.10, 0.0, abs(d - uReveal)) * step(uReveal, 0.999);
  col += uGold * front * 1.3;

  float alpha = edge * clamp(rev + front, 0.0, 1.0);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(col, alpha);
}
`

function Portrait({ tier }: { tier: Tier }) {
  const low = tier === 'low'
  const tex = useTexture(identity.photo)
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const group = useRef<THREE.Group>(null!)
  const ringA = useRef<THREE.Mesh>(null!)
  const ringB = useRef<THREE.Mesh>(null!)
  const dust = useRef<THREE.Points>(null!)
  const [hovered, setHovered] = useState(false)
  const hoverV = useRef(0)
  const born = useRef(0)
  const { viewport } = useThree()

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = low ? 2 : 8
    tex.needsUpdate = true
  }, [tex, low])

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uReveal: { value: 0 },
      uFocus: { value: new THREE.Vector2(0.52, 0.6) },
      uZoom: { value: 0.94 },
      uViolet: { value: new THREE.Color('#7d55ff') },
      uGold: { value: new THREE.Color('#f5c451') },
    }),
    [tex],
  )

  const dustGeo = useMemo(() => {
    const n = low ? 90 : 220
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.14 + Math.pow(Math.random(), 1.8) * 0.16
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.45
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [low])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    // échelle recalculée en continu : le portrait remplit toujours son conteneur
    const s = Math.min(state.viewport.width, state.viewport.height) * 0.42
    if (group.current) group.current.scale.setScalar(s)
    hoverV.current += ((hovered ? 1 : 0) - hoverV.current) * 0.08
    if (born.current === 0) born.current = t
    const reveal = Math.min(1.35, (t - born.current) / 1.1)

    if (mat.current) {
      mat.current.uniforms.uTime.value = t
      mat.current.uniforms.uHover.value = hoverV.current
      mat.current.uniforms.uReveal.value = reveal
    }
    if (group.current) {
      const px = state.pointer.x
      const py = state.pointer.y
      group.current.rotation.y += (px * 0.22 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (-py * 0.16 - group.current.rotation.x) * 0.05
      group.current.position.y = Math.sin(t * 0.6) * 0.04
    }
    if (ringA.current) {
      ringA.current.rotation.z += d * 0.25
      ringA.current.rotation.x = 0.35 + Math.sin(t * 0.3) * 0.14
    }
    if (ringB.current) {
      ringB.current.rotation.z -= d * 0.17
      ringB.current.rotation.y = 0.5 + Math.cos(t * 0.24) * 0.2
    }
    if (dust.current) dust.current.rotation.z += d * 0.09
  })

  return (
    <group ref={group} scale={Math.min(viewport.width, viewport.height) * 0.42}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[1, low ? 64 : 128]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* halo arrière — volontairement contenu dans le canvas */}
      <mesh position={[0, 0, -0.15]} scale={1.08}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#5320cc"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* anneaux orbitaux */}
      <mesh ref={ringA}>
        <torusGeometry args={[1.09, 0.007, 8, low ? 64 : 160]} />
        <meshBasicMaterial
          color="#f5c451"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringB} scale={1.06}>
        <torusGeometry args={[1.09, 0.0035, 8, low ? 48 : 128]} />
        <meshBasicMaterial
          color="#9c7dff"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* poussière orbitale */}
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial
          size={0.018}
          color="#ffe6ad"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function PortraitOrb({ className = '' }: { className?: string }) {
  return (
    <Scene
      className={className}
      once
      inert={false}
      rootMargin="200px"
      camera={{ position: [0, 0, 5], fov: 45 }}
      fallback={
        <img
          src={identity.photo}
          alt={`${identity.firstName} ${identity.lastName}`}
          className="h-full w-full rounded-full object-cover ring-1 ring-gold-400/40"
          loading="eager"
        />
      }
    >
      {(tier) => <Portrait tier={tier} />}
    </Scene>
  )
}
