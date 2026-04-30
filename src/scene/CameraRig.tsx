import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Smooth mouse-parallax camera.
 * Base position: [0, 8, 20] — high enough to see the whole scene without seabed dominating.
 */
export default function CameraRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame(({ pointer }) => {
    target.current.x = pointer.x * 2.0
    target.current.y = pointer.y * 1.0

    camera.position.x = lerp(camera.position.x, target.current.x, 0.022)
    camera.position.y = lerp(camera.position.y, 8 + target.current.y, 0.022)
    camera.position.z = lerp(camera.position.z, 20, 0.022)
    camera.lookAt(0, 1.5, 0)
  })

  return null
}
