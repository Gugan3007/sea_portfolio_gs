import { useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

useGLTF.preload('/models/seahorse.glb')

// Reduced to 4 seahorses only
const SPOTS: [number, number][] = [
  [-7, -4],
  [ 5, -6],
  [-10,  6],
  [  8,  5],
]

function SeahorseUnit({ pos }: { pos: [number, number] }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/seahorse.glb')
  const cloned = useMemo(() => scene.clone(true), [scene])
  const { actions, names } = useAnimations(animations, group)

  const s = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const sz  = new THREE.Vector3(); box.getSize(sz)
    const m   = Math.max(sz.x, sz.y, sz.z)
    return m > 0 ? 0.9 / m : 0.5
  }, [cloned])

  useMemo(() => {
    if (names.length > 0) {
      const a = actions[names[0]]
      if (a) { a.reset().play(); a.timeScale = 0.65 }
    }
  }, [actions, names])

  useFrame((state) => {
    if (!group.current) return
    const t     = state.clock.elapsedTime
    const phase = pos[0] * 0.4 + pos[1] * 0.3
    group.current.position.y = 3.0 + Math.sin(t * 0.35 + phase) * 0.7
    group.current.rotation.y = Math.sin(t * 0.15 + phase) * 0.25
  })

  return (
    <group ref={group} position={[pos[0], 3.0, pos[1]]} scale={[s, s, s]}>
      <pointLight color="#ffcc88" intensity={1.5} distance={5} decay={2} />
      <primitive object={cloned} />
    </group>
  )
}

export default function Seahorse() {
  return (
    <>
      {SPOTS.map((p, i) => <SeahorseUnit key={i} pos={p} />)}
    </>
  )
}
