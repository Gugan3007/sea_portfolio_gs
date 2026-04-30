import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/whale.glb')

/**
 * Whale — slow, majestic, patrols the deep background.
 */
export default function Jellyfish() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/whale.glb')
  const { actions, names } = useAnimations(animations, group)
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  const timeRef = useRef(0)

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-30, 10, -25),
    new THREE.Vector3(  0, 12, -30),
    new THREE.Vector3( 30, 10, -20),
    new THREE.Vector3( 20, 11,   0),
    new THREE.Vector3(-10, 13, -10),
    new THREE.Vector3(-30, 10, -25),
  ], true), [])

  const _tangent = useMemo(() => new THREE.Vector3(), [])
  const _current = useMemo(() => new THREE.Vector3(0, 0, 1), [])

  useMemo(() => {
    if (names.length > 0) {
      const action = actions[names[0]]
      if (action) { action.reset().play(); action.timeScale = 0.5 }
    }
  }, [actions, names])

  useFrame((state, delta) => {
    if (!group.current) return
    timeRef.current += delta * 0.007
    const t = timeRef.current % 1
    const pos = curve.getPointAt(t)
    curve.getTangentAt(t, _tangent)
    group.current.position.copy(pos)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.2) * 0.6
    _current.lerp(_tangent.normalize(), 0.015).normalize()
    group.current.lookAt(pos.x + _current.x, pos.y + _current.y, pos.z + _current.z)
  })

  return (
    <group ref={group} scale={[3.5, 3.5, 3.5]}>
      <primitive object={clonedScene} />
    </group>
  )
}
