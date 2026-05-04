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

    const activeIndex = (window as any).__activeSectionIndex || 0
    // Parallax depth/height offsets based on which section the user scrolled to
    // Reduced vertical multiplier to prevent clipping into seabed objects
    const scrollParallaxY = -activeIndex * 0.7 
    const scrollParallaxZ = activeIndex * 0.6

    camera.position.x = lerp(camera.position.x, target.current.x, 0.022)
    camera.position.y = lerp(camera.position.y, 8 + target.current.y + scrollParallaxY, 0.022)
    camera.position.z = lerp(camera.position.z, 20 + scrollParallaxZ, 0.022)
    
    // Keep a stable, safe lookAt point so the scene never 'collapses' upside down
    camera.lookAt(0, 2.0, 0)
  })

  return null
}
