import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 220

/**
 * Rising bubble particles from seabed.
 * Small, slow, random drift — very atmospheric.
 */
export default function BubbleParticles() {
  const geo = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const sizes      = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      positions[ix]     = (Math.random() - 0.5) * 50
      positions[ix + 1] = Math.random() * 22
      positions[ix + 2] = (Math.random() - 0.5) * 50
      sizes[i]          = 0.04 + Math.random() * 0.08
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))
    return g
  }, [])

  const velocities = useMemo(() => {
    const v = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      v[ix]     = (Math.random() - 0.5) * 0.008
      v[ix + 1] = 0.012 + Math.random() * 0.018   // upward
      v[ix + 2] = (Math.random() - 0.5) * 0.008
    }
    return v
  }, [])

  useFrame(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      pos.array[ix]     += velocities[ix]
      pos.array[ix + 1] += velocities[ix + 1]
      pos.array[ix + 2] += velocities[ix + 2]
      // Reset when reaching the water surface
      if (pos.array[ix + 1] > 24) {
        pos.array[ix]     = (Math.random() - 0.5) * 50
        pos.array[ix + 1] = -0.5
        pos.array[ix + 2] = (Math.random() - 0.5) * 50
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial
        size={0.06}
        color="#aaddff"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
