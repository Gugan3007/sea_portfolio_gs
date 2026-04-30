import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/eagle_ray.glb')

/**
 * Eagle Ray — large, graceful, glides low over the seabed in a wide oval.
 */
export default function EagleRay() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/eagle_ray.glb')
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.rotation.y = Math.PI // Fix model facing backward
    return c
  }, [scene])
  const { actions, names } = useAnimations(animations, group)
  const timeRef = useRef(0)

  // Auto-scale to 5 world units wingspan
  const s = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const sz = new THREE.Vector3(); box.getSize(sz)
    const m = Math.max(sz.x, sz.y, sz.z)
    return m > 0 ? 5.0 / m : 1.0
  }, [cloned])

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-18, 1.2, -12),
    new THREE.Vector3(  0, 1.5, -20),
    new THREE.Vector3( 18, 1.2, -10),
    new THREE.Vector3( 22, 1.4,   4),
    new THREE.Vector3(  8, 1.2,  16),
    new THREE.Vector3(-12, 1.5,  14),
    new THREE.Vector3(-20, 1.2,   0),
    new THREE.Vector3(-18, 1.2, -12),
  ], true), [])

  const _tangent = useMemo(() => new THREE.Vector3(), [])
  const _current = useMemo(() => new THREE.Vector3(0, 0, 1), [])

  useMemo(() => {
    if (names.length > 0) {
      const a = actions[names[0]]
      if (a) { a.reset().play(); a.timeScale = 0.6 }
    }
  }, [actions, names])

  useFrame((state, delta) => {
    if (!group.current) return
    timeRef.current += delta * 0.018
    const t = timeRef.current % 1
    const pos = curve.getPointAt(t)
    curve.getTangentAt(t, _tangent)
    group.current.position.copy(pos)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    _current.lerp(_tangent.normalize(), 0.03).normalize()
    group.current.lookAt(pos.x + _current.x, pos.y + _current.y, pos.z + _current.z)
  })

  return (
    <group ref={group} scale={[s, s, s]}>
      <primitive object={cloned} />
    </group>
  )
}
