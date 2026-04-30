import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 600

/**
 * Marine snow — particles drifting slowly downward.
 * Mimics suspended organic matter common in deep water.
 */
export default function MarineSnow() {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      positions[ix]     = (Math.random() - 0.5) * 80
      positions[ix + 1] = Math.random() * 40 - 2
      positions[ix + 2] = (Math.random() - 0.5) * 80
      velocities[ix]     = (Math.random() - 0.5) * 0.012
      velocities[ix + 1] = -(0.018 + Math.random() * 0.025)
      velocities[ix + 2] = (Math.random() - 0.5) * 0.012
    }
    return { positions, velocities }
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  useFrame(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      pos.array[ix]     += velocities[ix]
      pos.array[ix + 1] += velocities[ix + 1]
      pos.array[ix + 2] += velocities[ix + 2]
      // Reset when below seabed
      if (pos.array[ix + 1] < -2) {
        pos.array[ix]     = (Math.random() - 0.5) * 80
        pos.array[ix + 1] = 38
        pos.array[ix + 2] = (Math.random() - 0.5) * 80
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef} geometry={geo} frustumCulled={false}>
      <pointsMaterial
        size={0.08}
        color="#aaddff"
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
