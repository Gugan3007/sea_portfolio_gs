import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/trout.glb')

const NEMO_COUNT = 12

const FISH_PARAMS = Array.from({ length: NEMO_COUNT }, (_, i) => ({
  radius:  1.0 + (i % 4) * 0.4,
  speed:   0.35 + (i % 3) * 0.08,
  phase:   (i / NEMO_COUNT) * Math.PI * 2,
  yOffset: (Math.random() - 0.5) * 0.9,
  yBob:    0.12 + Math.random() * 0.12,
  bobRate: 1.2 + Math.random() * 0.8,
  scale:   0.85 + (i % 4) * 0.08,
}))

const NEMO_PALETTE = [
  new THREE.Color('#ff5500'),
  new THREE.Color('#ff7722'),
  new THREE.Color('#ff8833'),
  new THREE.Color('#ffaa55'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#ff4400'),
]

export default function NemoSchool() {
  const { scene, animations } = useGLTF('/models/trout.glb')
  
  const baseScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sz  = new THREE.Vector3()
    box.getSize(sz)
    const m = Math.max(sz.x || 1, sz.y || 1, sz.z || 1)
    return 0.48 / m
  }, [scene])


  
  // Clone the full scene to preserve all parts of the fish
  const clones = useMemo(() => {
    return Array.from({ length: NEMO_COUNT }, (_, i) => {
      const clone = scene.clone(true)
      clone.rotation.y = Math.PI // Fix model swimming backward
      const c = NEMO_PALETTE[i % NEMO_PALETTE.length].clone()
      
      clone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh
          if (m.material) {
            m.material = (m.material as THREE.Material).clone()
            if ('color' in m.material) {
              ;(m.material as any).color.copy(c)
            }
            if ('emissive' in m.material) {
              ;(m.material as any).emissive.set('#441100')
              ;(m.material as any).emissiveIntensity = 0.5
            }
          }
        }
      })
      return clone
    })
  }, [scene])

  // Need separate useAnimations hook for each clone since they have their own mixers
  // But we can simplify by just playing the animation manually or letting the GLTF handle it if we wrapped each in a component.
  // Instead of useAnimations for an array of clones, creating a small sub-component for each fish is easiest to manage animation.
  return (
    <group>
      <pointLight color="#ff5500" intensity={5} distance={12} decay={2} position={[0, 3, 0]} />
      {clones.map((clone, i) => (
        <NemoFish 
          key={i} 
          clone={clone} 
          animations={animations} 
          params={FISH_PARAMS[i]} 
          baseScale={baseScale} 
        />
      ))}
    </group>
  )
}

function NemoFish({ clone, animations, params, baseScale }: any) {
  const group = useRef<THREE.Group>(null)
  const { actions, names } = useAnimations(animations, group)
  const timeRef = useRef(Math.random() * 10) // random start time
  
  const _dir = useMemo(() => new THREE.Vector3(), [])
  const _mat4 = useMemo(() => new THREE.Matrix4(), [])
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const _q = useMemo(() => new THREE.Quaternion(), [])

  useEffect(() => {
    if (names.length > 0) {
      const a = actions[names[0]]
      if (a) { a.reset().play(); a.timeScale = 1.0 + params.speed }
    }
  }, [actions, names, params.speed])

  useFrame((_, delta) => {
    if (!group.current) return
    timeRef.current += delta
    const t = timeRef.current

    const groupX  = Math.sin(t * 0.12) * 5
    const groupY  = 3.0 + Math.sin(t * 0.08) * 0.8
    const groupZ  = Math.cos(t * 0.09) * 4

    const ft = t * params.speed + params.phase
    const x = groupX + Math.cos(ft) * params.radius
    const y = groupY + params.yOffset + Math.sin(t * params.bobRate + params.phase) * params.yBob
    const z = groupZ + Math.sin(ft) * params.radius

    const nx = -Math.sin(ft) * params.speed
    const nz =  Math.cos(ft) * params.speed

    group.current.position.set(x, y, z)
    _dir.set(nx, 0, nz).normalize()
    if (_dir.lengthSq() > 0.001) {
      _mat4.lookAt(group.current.position, group.current.position.clone().add(_dir), _up)
      _q.setFromRotationMatrix(_mat4)
      group.current.quaternion.copy(_q)
    }
    group.current.scale.setScalar(baseScale * params.scale)
  })

  return (
    <group ref={group}>
      <primitive object={clone} />
    </group>
  )
}
