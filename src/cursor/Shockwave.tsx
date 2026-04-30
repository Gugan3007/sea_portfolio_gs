import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Click shockwave/ripple effect that expands outward and fades.
 * Also pushes nearby boids via the shared shockwave position.
 */
interface ShockwaveInstance {
  id: number
  position: THREE.Vector3
  scale: number
  opacity: number
  alive: boolean
}

interface ShockwaveProps {
  shockwavePos: React.MutableRefObject<THREE.Vector3 | null>
}

let nextId = 0

export default function Shockwave({ shockwavePos }: ShockwaveProps) {
  const [waves, setWaves] = useState<ShockwaveInstance[]>([])
  const wavesRef = useRef<ShockwaveInstance[]>([])

  // Called from parent when click occurs
  const trigger = (pos: THREE.Vector3) => {
    const wave: ShockwaveInstance = {
      id: nextId++,
      position: pos.clone(),
      scale: 0.1,
      opacity: 1.0,
      alive: true,
    }
    wavesRef.current.push(wave)
    setWaves([...wavesRef.current])

    // Set shockwave position for boids avoidance
    shockwavePos.current = pos.clone()

    // Clear shockwave after 0.8s
    setTimeout(() => {
      shockwavePos.current = null
    }, 800)
  }

  // Expose trigger via ref on window for parent access
  if (typeof window !== 'undefined') {
    (window as any).__triggerShockwave = trigger
  }

  useFrame((_, delta) => {
    let changed = false
    for (let i = wavesRef.current.length - 1; i >= 0; i--) {
      const w = wavesRef.current[i]
      w.scale += delta * 12
      w.opacity -= delta * 2.0
      if (w.opacity <= 0) {
        wavesRef.current.splice(i, 1)
        changed = true
      }
    }
    if (changed) {
      setWaves([...wavesRef.current])
    }
  })

  return (
    <>
      {waves.map((w) => (
        <mesh key={w.id} position={w.position} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[w.scale * 0.8, w.scale, 32]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={2.0}
            transparent
            opacity={w.opacity * 0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}
