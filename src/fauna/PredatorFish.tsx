import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/shark.glb')

const _box = new THREE.Box3()
const _siz = new THREE.Vector3()

export default function PredatorFish() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/shark.glb')
  const { actions, names } = useAnimations(animations, group)
  const timeRef = useRef(0)

  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Auto-scale: shark = 6 world units long (dominant predator)
  const sharkScale = useMemo(() => {
    _box.setFromObject(clonedScene)
    _box.getSize(_siz)
    const maxDim = Math.max(_siz.x, _siz.y, _siz.z)
    return maxDim > 0 ? 6.0 / maxDim : 2.0
  }, [clonedScene])

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-22, 5.5, -18),
    new THREE.Vector3(-8,  6.5, -10),
    new THREE.Vector3(12,  5.0, -14),
    new THREE.Vector3(20,  6.0,   0),
    new THREE.Vector3(12,  5.5,  12),
    new THREE.Vector3(-8,  6.5,  10),
    new THREE.Vector3(-22, 5.5, -18),
  ], true), [])

  const _target  = useMemo(() => new THREE.Vector3(), [])
  const _current = useMemo(() => new THREE.Vector3(0, 0, 1), [])

  useMemo(() => {
    if (names.length > 0) {
      const action = actions[names[0]]
      if (action) { action.reset().play(); action.timeScale = 0.85 }
    }
  }, [actions, names])

  useFrame((state, delta) => {
    if (!group.current) return
    timeRef.current += delta * 0.022
    const t = timeRef.current % 1
    const pos = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    group.current.position.copy(pos)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.35) * 0.5
    _target.copy(tangent).normalize()
    _current.lerp(_target, 0.025).normalize()
    group.current.lookAt(
      pos.x + _current.x,
      pos.y + _current.y,
      pos.z + _current.z,
    )
  })

  return (
    <group ref={group} scale={[sharkScale, sharkScale, sharkScale]}>
      {/* Subtle blue-grey glow to distinguish the shark */}
      <pointLight color="#4488ff" intensity={3} distance={12} decay={2} position={[0, 0, 0]} />
      <primitive object={clonedScene} />
    </group>
  )
}
