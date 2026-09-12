import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Caméra qui suit doucement le pointeur / le gyroscope simulé par le scroll. */
export default function Rig({
  strength = 0.55,
  damping = 0.035,
  lookAt = true,
}: {
  strength?: number
  damping?: number
  lookAt?: boolean
}) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  const base = useRef(camera.position.clone())

  useFrame((state) => {
    target.current.set(
      base.current.x + state.pointer.x * strength,
      base.current.y + state.pointer.y * strength * 0.7,
      base.current.z,
    )
    camera.position.lerp(target.current, damping)
    if (lookAt) camera.lookAt(0, 0, 0)
  })

  return null
}
