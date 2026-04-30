import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * God rays — volumetric light shafts piercing down from the surface.
 * Each ray is a semi-transparent cone with animated alpha pulse.
 */
const RAY_CONFIG = [
  { x: -4,  z: -6,  rot: 0.08,  opacity: 0.07, height: 28 },
  { x:  5,  z: -10, rot: -0.06, opacity: 0.055, height: 32 },
  { x:  0,  z:  2,  rot:  0.04, opacity: 0.08,  height: 25 },
  { x: -8,  z:  5,  rot:  0.10, opacity: 0.045, height: 30 },
  { x:  9,  z:  0,  rot: -0.07, opacity: 0.06,  height: 27 },
]

interface RayProps {
  x: number; z: number; rot: number; opacity: number; height: number
}

function GodRay({ x, z, rot, opacity, height }: RayProps) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.01, 2.5, height, 6, 1, true)
    g.translate(0, -height / 2, 0)
    return g
  }, [height])

  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = clock.elapsedTime
      matRef.current.opacity = opacity * (0.7 + Math.sin(t * 0.4 + x) * 0.3)
    }
  })

  return (
    <mesh geometry={geo} position={[x, 26, z]} rotation={[0, rot, 0.02]}>
      <meshBasicMaterial
        ref={matRef}
        color="#7dd4f7"
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function GodRays() {
  return (
    <>
      {RAY_CONFIG.map((r, i) => <GodRay key={i} {...r} />)}
    </>
  )
}
