import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform vec2  uPointer;
attribute float aSeed;
attribute float aScale;
varying float vSeed;
varying float vDepth;

void main() {
  vec3 p = position;
  float t = uTime * 0.14;
  float s = aSeed * 6.28318;
  p.x += sin(t + s) * 0.55;
  p.y += cos(t * 0.85 + s * 2.0) * 0.55;
  p.z += sin(t * 0.65 + s * 1.3) * 0.45;

  // parallaxe douce liée au pointeur : les particules proches bougent plus
  p.xy += uPointer * (0.35 + aScale * 0.8);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // taille bornée : sans ça, une particule proche de la caméra couvre l'écran
  gl_PointSize = clamp(uSize * aScale * (170.0 / max(-mv.z, 2.0)), 0.8, 7.0);
  vSeed = aSeed;
  vDepth = -mv.z;
}
`

const frag = /* glsl */ `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;
varying float vSeed;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.02, d);
  a *= a;

  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.65, vSeed));
  col = mix(col, uColorC, smoothstep(0.86, 1.0, vSeed));

  // fondu au loin ET tout près : rien ne doit saturer l'écran
  float fadeFar  = smoothstep(52.0, 10.0, vDepth);
  float fadeNear = smoothstep(3.0, 9.0, vDepth);
  gl_FragColor = vec4(col, a * fadeFar * fadeNear * uOpacity);
}
`

type Props = {
  count?: number
  radius?: number
  size?: number
  opacity?: number
  speed?: number
}

export default function Nebula({
  count = 3000,
  radius = 16,
  size = 5.5,
  opacity = 0.9,
  speed = 1,
}: Props) {
  const points = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const scale = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // distribution en disque épais : dense au centre, diffuse aux bords
      const r = radius * Math.pow(Math.random(), 0.62)
      const theta = Math.random() * Math.PI * 2
      const spread = 1 - r / radius
      pos[i * 3] = Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(theta) * r * 0.68
      pos[i * 3 + 2] = -4 - Math.random() * (10 + spread * 16)
      seed[i] = Math.random()
      scale[i] = 0.3 + Math.pow(Math.random(), 3.0) * 1.4
    }

    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    return g
  }, [count, radius])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uOpacity: { value: opacity },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#7d55ff') },
      uColorB: { value: new THREE.Color('#b9a5ff') },
      uColorC: { value: new THREE.Color('#f5c451') },
    }),
    [size, opacity],
  )

  useFrame((state, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value += Math.min(delta, 0.05) * speed
    const px = (state.pointer.x * viewport.width) / 26
    const py = (state.pointer.y * viewport.height) / 26
    u.uPointer.value.lerp({ x: px, y: py } as THREE.Vector2, 0.045)
    points.current.rotation.z += delta * 0.008
  })

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
