import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { randomRange } from '../utils/math'

useGLTF.preload('/models/rocks.glb')

const Y = -0.6

const ROCK_SPOTS = Array.from({ length: 22 }, () => ({
  x: randomRange(-30, 30), z: randomRange(-30, 30),
  ry: randomRange(0, Math.PI * 2),
  sx: randomRange(0.6, 2.0), sy: randomRange(0.5, 1.3),
}))

export default function Rocks() {
  const { scene } = useGLTF('/models/rocks.glb')

  const base = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sz  = new THREE.Vector3(); box.getSize(sz)
    const m   = Math.max(sz.x, sz.y, sz.z)
    return m > 0 ? 1.4 / m : 1.0
  }, [scene])

  const rocks = useMemo(() => ROCK_SPOTS.map(r => ({ ...r, clone: scene.clone(true) })), [scene])

  return (
    <>
      {rocks.map((r, i) => (
        <primitive key={i} object={r.clone}
          position={[r.x, Y, r.z]}
          rotation={[0, r.ry, 0]}
          scale={[base * r.sx, base * r.sy, base * r.sx]}
        />
      ))}
    </>
  )
}
