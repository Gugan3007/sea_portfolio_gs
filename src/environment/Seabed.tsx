import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Dark sandy seabed — flat at y=-0.6.
 * Dark colour stops the bright reflection wash.
 */
export default function Seabed() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 1, 1)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow position={[0, -0.6, 0]}>
      <meshStandardMaterial
        color="#2e2416"
        roughness={1.0}
        metalness={0.0}
        envMapIntensity={0}
      />
    </mesh>
  )
}
