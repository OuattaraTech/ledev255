import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { snoise3 } from '../../lib/glsl'

const vert = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uPulse;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

${snoise3}

vec3 displaced(vec3 p, vec3 n) {
  float t = uTime * 0.22;
  float n1 = snoise(p * uFreq + vec3(t, t * 0.7, -t * 0.5));
  float n2 = snoise(p * (uFreq * 2.3) + vec3(-t * 0.8, t * 1.1, t * 0.6)) * 0.42;
  float d = (n1 + n2) * uAmp * (1.0 + uPulse);
  return p + n * d;
}

void main() {
  vec3 n = normalize(normal);
  vec3 p = displaced(position, n);

  // normale recalculée par différences finies sur la tangente locale
  vec3 tangent = normalize(cross(n, vec3(0.0, 1.0, 0.0) + 0.001));
  vec3 bitan = normalize(cross(n, tangent));
  float e = 0.055;
  vec3 pa = displaced(position + tangent * e, n);
  vec3 pb = displaced(position + bitan * e, n);
  vec3 newNormal = normalize(cross(pa - p, pb - p));
  if (dot(newNormal, n) < 0.0) newNormal = -newNormal;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * newNormal);
  vView = normalize(-mv.xyz);
  vDisp = length(p) - length(position);

  gl_Position = projectionMatrix * mv;
}
`

const frag = /* glsl */ `
precision highp float;
uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorRim;
uniform float uOpacity;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  float lambert = clamp(dot(n, normalize(vec3(0.6, 0.9, 0.7))), 0.0, 1.0);

  vec3 col = mix(uColorDeep, uColorMid, lambert * 0.85);
  col = mix(col, uColorRim, fres * 0.7);
  col += uColorRim * smoothstep(0.06, 0.34, vDisp) * 0.32;

  float alpha = clamp(0.16 + fres * 0.72, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(col, alpha);
}
`

const haloVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const haloFrag = /* glsl */ `
precision mediump float;
uniform vec3 uInner;
uniform vec3 uOuter;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(1.0 - clamp(d, 0.0, 1.0), 2.8);
  gl_FragColor = vec4(mix(uOuter, uInner, a), a * 0.55);
}
`

type Props = {
  detail?: number
  radius?: number
  amp?: number
  className?: string
}

export default function CoreOrb({ detail = 24, radius = 1.55, amp = 0.34 }: Props) {
  const group = useRef<THREE.Group>(null!)
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const wire = useRef<THREE.Mesh>(null!)

  const haloUniforms = useMemo(
    () => ({
      uInner: { value: new THREE.Color('#6a35f5') },
      uOuter: { value: new THREE.Color('#1a0a4d') },
    }),
    [],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      uFreq: { value: 0.85 },
      uPulse: { value: 0 },
      uOpacity: { value: 1 },
      uColorDeep: { value: new THREE.Color('#1a0a4d') },
      uColorMid: { value: new THREE.Color('#6a35f5') },
      uColorRim: { value: new THREE.Color('#e8c887') },
    }),
    [amp],
  )

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    if (mat.current) {
      mat.current.uniforms.uTime.value += d
      mat.current.uniforms.uPulse.value = Math.sin(t * 0.55) * 0.22
    }
    if (group.current) {
      group.current.rotation.y += d * 0.14
      group.current.rotation.x = Math.sin(t * 0.22) * 0.16
    }
    if (wire.current) {
      wire.current.rotation.y -= d * 0.22
      wire.current.rotation.z += d * 0.05
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[radius, detail]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Cage filaire contre-rotative */}
      <mesh ref={wire} scale={1.42}>
        <icosahedronGeometry args={[radius, 1]} />
        <meshBasicMaterial
          color="#9c7dff"
          wireframe
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo doux — dégradé radial, pas de bord net */}
      <mesh scale={2.5} position={[0, 0, -0.7]}>
        <circleGeometry args={[radius, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={haloUniforms}
          vertexShader={haloVert}
          fragmentShader={haloFrag}
        />
      </mesh>
    </group>
  )
}
