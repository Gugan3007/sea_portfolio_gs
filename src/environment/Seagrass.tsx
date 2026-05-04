import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { randomRange } from '../utils/math'

useGLTF.preload('/models/kelp.glb')
useGLTF.preload('/models/plant.glb')

const KELP_SPOTS  = Array.from({ length: 38 }, () => ({ x: randomRange(-30,30), z: randomRange(-30,30), ry: randomRange(0,Math.PI*2), s: randomRange(0.9,2.0) }))
const PLANT_SPOTS = Array.from({ length: 18 }, () => ({ x: randomRange(-26,26), z: randomRange(-26,26), ry: randomRange(0,Math.PI*2), s: randomRange(0.6,1.4) }))

/**
 * Auto-scale to `target` units.
 * Returns { scale, yOffset } where yOffset lifts the model so its
 * bounding-box MINIMUM sits exactly at the seabed surface (y=−0.6).
 */
function computePlacement(scene: THREE.Group, target: number, seabedY: number) {
  const box = new THREE.Box3().setFromObject(scene)
  const sz  = new THREE.Vector3(); box.getSize(sz)
  const m   = Math.max(sz.x, sz.y, sz.z)
  const baseScale = m > 0 ? target / m : 1.0
  return { baseScale, minY: box.min.y, seabedY }
}

export default function Seagrass() {
  const { scene: kScene } = useGLTF('/models/kelp.glb')
  const { scene: pScene } = useGLTF('/models/plant.glb')

  const kPlacement = useMemo(() => computePlacement(kScene, 2.2, -0.6), [kScene])
  const pPlacement = useMemo(() => computePlacement(pScene, 1.6, -0.6), [pScene])

  const kelps  = useMemo(() => KELP_SPOTS.map(p  => ({ ...p, clone: kScene.clone(true) })), [kScene])
  const plants = useMemo(() => PLANT_SPOTS.map(p => ({ ...p, clone: pScene.clone(true) })), [pScene])

  return (
    <>
      {kelps.map((k, i) => {
        const sc = kPlacement.baseScale * k.s
        const y = kPlacement.seabedY - kPlacement.minY * sc
        return (
          <primitive key={`k-${i}`} object={k.clone}
            position={[k.x, y, k.z]}
            rotation={[0, k.ry, 0]}
            scale={[sc, sc, sc]}
          />
        )
      })}
      {plants.map((p, i) => {
        const sc = pPlacement.baseScale * p.s
        const y = pPlacement.seabedY - pPlacement.minY * sc
        return (
          <primitive key={`p-${i}`} object={p.clone}
            position={[p.x, y, p.z]}
            rotation={[0, p.ry, 0]}
            scale={[sc, sc, sc]}
          />
        )
      })}
    </>
  )
}
