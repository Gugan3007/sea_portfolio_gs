import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { randomRange } from '../utils/math'

useGLTF.preload('/models/coral.glb')
useGLTF.preload('/models/coral2.glb')
useGLTF.preload('/models/anemone.glb')
useGLTF.preload('/models/env_coral.glb')

const CORAL_SPOTS    = Array.from({ length: 20 }, () => ({ x: randomRange(-26,26), z: randomRange(-26,26), ry: randomRange(0,Math.PI*2), s: randomRange(0.7,1.6) }))
const CORAL2_SPOTS   = Array.from({ length: 14 }, () => ({ x: randomRange(-24,24), z: randomRange(-24,24), ry: randomRange(0,Math.PI*2), s: randomRange(0.5,1.3) }))
const ANEM_SPOTS     = Array.from({ length: 10 }, () => ({ x: randomRange(-20,20), z: randomRange(-20,20), ry: randomRange(0,Math.PI*2), s: randomRange(0.4,0.8) }))
const ENVCORAL_SPOTS = Array.from({ length: 7  }, () => ({ x: randomRange(-28,28), z: randomRange(-28,28), ry: randomRange(0,Math.PI*2), s: randomRange(0.9,1.8) }))

const SEABED = -0.6

function computePlacement(scene: THREE.Group, target: number) {
  const box = new THREE.Box3().setFromObject(scene)
  const sz  = new THREE.Vector3(); box.getSize(sz)
  const m   = Math.max(sz.x, sz.y, sz.z)
  const baseScale = m > 0 ? target / m : 1.0
  return { baseScale, minY: box.min.y }
}

export default function Corals() {
  const { scene: cScene  } = useGLTF('/models/coral.glb')
  const { scene: c2Scene } = useGLTF('/models/coral2.glb')
  const { scene: aScene  } = useGLTF('/models/anemone.glb')
  const { scene: eScene  } = useGLTF('/models/env_coral.glb')

  const cP  = useMemo(() => computePlacement(cScene,  1.8), [cScene])
  const c2P = useMemo(() => computePlacement(c2Scene, 2.2), [c2Scene])
  const aP  = useMemo(() => computePlacement(aScene,  0.9), [aScene])
  const eP  = useMemo(() => computePlacement(eScene,  3.5), [eScene])

  const corals    = useMemo(() => CORAL_SPOTS.map(p    => ({ ...p, clone: cScene.clone(true)  })), [cScene])
  const corals2   = useMemo(() => CORAL2_SPOTS.map(p   => ({ ...p, clone: c2Scene.clone(true) })), [c2Scene])
  const anemones  = useMemo(() => ANEM_SPOTS.map(p     => ({ ...p, clone: aScene.clone(true)  })), [aScene])
  const envCorals = useMemo(() => ENVCORAL_SPOTS.map(p => ({ ...p, clone: eScene.clone(true)  })), [eScene])

  return (
    <>
      {corals.map((c, i)    => { const sc = cP.baseScale  * c.s;  const y = SEABED - cP.minY  * sc; return <primitive key={`c1-${i}`} object={c.clone} position={[c.x, y, c.z]} rotation={[0,c.ry,0]} scale={[sc,sc,sc]} /> })}
      {corals2.map((c, i)   => { const sc = c2P.baseScale * c.s;  const y = SEABED - c2P.minY * sc; return <primitive key={`c2-${i}`} object={c.clone} position={[c.x, y, c.z]} rotation={[0,c.ry,0]} scale={[sc,sc,sc]} /> })}
      {anemones.map((a, i)  => { const sc = aP.baseScale  * a.s;  const y = SEABED - aP.minY  * sc; return <primitive key={`an-${i}`} object={a.clone} position={[a.x, y, a.z]} rotation={[0,a.ry,0]} scale={[sc,sc,sc]} /> })}
      {envCorals.map((e, i) => { const sc = eP.baseScale  * e.s;  const y = SEABED - eP.minY  * sc; return <primitive key={`ec-${i}`} object={e.clone} position={[e.x, y, e.z]} rotation={[0,e.ry,0]} scale={[sc,sc,sc]} /> })}
    </>
  )
}
