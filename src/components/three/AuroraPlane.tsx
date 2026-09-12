import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'
import { snoise3 } from '../../lib/glsl'

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const frag = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform vec2  uRes;
uniform vec3  uA;
uniform vec3  uB;
uniform vec3  uC;
varying vec2 vUv;

${snoise3}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  float t = uTime * 0.055;

  float n1 = snoise(vec3(p * 1.5, t));
  float n2 = snoise(vec3(p * 3.1 + 12.0, t * 1.4)) * 0.5;
  float n = n1 + n2;

  // rubans d'aurore
  float bands = sin((p.y * 3.4 + n * 1.5) * 3.14159) * 0.5 + 0.5;
  bands = pow(bands, 2.6);

  vec3 col = mix(uA, uB, clamp(n * 0.5 + 0.5, 0.0, 1.0));
  col = mix(col, uC, pow(clamp(n2 + 0.5, 0.0, 1.0), 3.0) * 0.85);
  col *= bands;

  // fondu vers les bords
  float vig = smoothstep(1.05, 0.15, length(uv - 0.5) * 1.7);
  float alpha = clamp(bands * 0.55, 0.0, 1.0) * vig;

  gl_FragColor = vec4(col, alpha);
}
`

function Aurora() {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uA: { value: new THREE.Color('#2b0d78') },
      uB: { value: new THREE.Color('#7d55ff') },
      uC: { value: new THREE.Color('#f5c451') },
    }),
    [],
  )

  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += Math.min(delta, 0.05)
    mat.current.uniforms.uRes.value.set(state.size.width, state.size.height)
    mesh.current?.scale.set(state.viewport.width, state.viewport.height, 1)
  })

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function AuroraPlane({ className = '' }: { className?: string }) {
  return (
    <Scene
      className={className}
      rootMargin="200px"
      camera={{ position: [0, 0, 1], fov: 50 }}
      fallback={null}
    >
      {() => <Aurora />}
    </Scene>
  )
}
