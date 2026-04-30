import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { randomRange } from '../utils/math'

useGLTF.preload('/models/sea_urchin.glb')

const Y = -0.6

const URCHIN_SPOTS = Array.from({ length: 15 }, () => ({
  x: randomRange(-24, 24), z: randomRange(-24, 24),
  ry: randomRange(0, Math.PI * 2),
}))

export default function SeaUrchin() {
  const { scene } = useGLTF('/models/sea_urchin.glb')

  const s = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sz  = new THREE.Vector3(); box.getSize(sz)
    const m   = Math.max(sz.x, sz.y, sz.z)
    return m > 0 ? 0.45 / m : 0.5
  }, [scene])

  const clones = useMemo(() => URCHIN_SPOTS.map(p => ({ ...p, clone: scene.clone(true) })), [scene])

  return (
    <>
      {clones.map((u, i) => (
        <primitive key={i} object={u.clone}
          position={[u.x, Y, u.z]}
          rotation={[0, u.ry, 0]}
          scale={[s, s, s]}
        />
      ))}
    </>
  )
}
