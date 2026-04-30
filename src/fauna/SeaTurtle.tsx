import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/turtle.glb')

const _box = new THREE.Box3()
const _siz = new THREE.Vector3()

export default function SeaTurtle() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/turtle.glb')
  const { actions, names } = useAnimations(animations, group)
  const timeRef = useRef(0)

  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Auto-scale: turtle = 2 world units (much smaller than the 6-unit shark)
  const turtleScale = useMemo(() => {
    _box.setFromObject(clonedScene)
    _box.getSize(_siz)
    const maxDim = Math.max(_siz.x, _siz.y, _siz.z)
    return maxDim > 0 ? 2.0 / maxDim : 1.0
  }, [clonedScene])

  // Smaller orbit closer to seabed than shark
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-12, 2.5, 5),
    new THREE.Vector3(-4,  3.0, -5),
    new THREE.Vector3( 8,  2.8, -3),
    new THREE.Vector3(14,  3.2,  4),
    new THREE.Vector3( 8,  2.5,  9),
    new THREE.Vector3(-4,  3.0,  8),
    new THREE.Vector3(-12, 2.5,  5),
  ], true), [])

  const _tangent = useMemo(() => new THREE.Vector3(), [])

  useMemo(() => {
    if (names.length > 0) {
      const action = actions[names[0]]
      if (action) { action.reset().play(); action.timeScale = 0.55 }
    }
  }, [actions, names])

  useFrame((state, delta) => {
    if (!group.current) return
    timeRef.current += delta * 0.009
    const t = timeRef.current % 1
    const pos = curve.getPointAt(t)
    curve.getTangentAt(t, _tangent)
    group.current.position.copy(pos)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.22) * 0.2
    group.current.lookAt(pos.x + _tangent.x, pos.y + _tangent.y, pos.z + _tangent.z)
  })

  return (
    <group ref={group} scale={[turtleScale, turtleScale, turtleScale]}>
      {/* Warm green highlight — bioluminescent shell */}
      <pointLight color="#44ff88" intensity={2.5} distance={8} decay={2} />
      <primitive object={clonedScene} />
    </group>
  )
}
