import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { BoidsSimulation } from './boids'

useGLTF.preload('/models/trout.glb')

const COUNT_A = 40
const COUNT_B = 28

const _dir   = new THREE.Vector3()
const _up    = new THREE.Vector3(0, 1, 0)
const _mat4  = new THREE.Matrix4()
const _q     = new THREE.Quaternion()

const PALETTE_A = [
  new THREE.Color('#00ccff'), new THREE.Color('#00eeff'),
  new THREE.Color('#22ff88'), new THREE.Color('#44ffcc'),
]
const PALETTE_B = [
  new THREE.Color('#aa44ff'), new THREE.Color('#cc66ff'),
  new THREE.Color('#4488ff'), new THREE.Color('#66aaff'),
]

interface Props {
  cursorPos: React.MutableRefObject<THREE.Vector3>
  shockwavePos: React.MutableRefObject<THREE.Vector3 | null>
}

interface SchoolProps {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
  count: number
  palette: THREE.Color[]
  boids: BoidsSimulation
  cursorPos: React.MutableRefObject<THREE.Vector3>
  shockwavePos: React.MutableRefObject<THREE.Vector3 | null>
}

function AnimatedFish({ clone, animations, registerGroup }: any) {
  const group = useRef<THREE.Group>(null)
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    registerGroup(group.current)
  }, [registerGroup])

  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]]
      if (action) {
        action.reset().play()
        action.timeScale = 1.0 + Math.random() * 0.8 // Randomize swim speed a bit
      }
    }
  }, [actions, names])

  return (
    <group ref={group}>
      <primitive object={clone} />
    </group>
  )
}

function School({ scene, animations, count, palette, boids, cursorPos, shockwavePos }: SchoolProps) {
  const groupRefs = useRef<(THREE.Group | null)[]>([])

  const baseScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sz = new THREE.Vector3()
    box.getSize(sz)
    const m = Math.max(sz.x || 1, sz.y || 1, sz.z || 1)
    return m > 0 ? 0.35 / m : 0.35 // Trout is naturally longer, scale down slightly for large school
  }, [scene])

  const clones = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const clone = scene.clone(true)
      clone.rotation.y = Math.PI // Fix model swimming backward
      const c = palette[i % palette.length].clone()
      c.offsetHSL((Math.random() - 0.5) * 0.06, 0, (Math.random() - 0.5) * 0.05)

      clone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh
          if (m.material) {
            m.material = (m.material as THREE.Material).clone()
            if ('color' in m.material) {
              ;(m.material as any).color.copy(c)
            }
          }
        }
      })
      return clone
    })
  }, [scene, count, palette])

  useFrame((_, delta) => {
    const pts: typeof boids.avoidPoints = []
    if (cursorPos.current) pts.push({ x: cursorPos.current.x, y: cursorPos.current.y, z: cursorPos.current.z, radius: 4, strength: 8 })
    if (shockwavePos.current) pts.push({ x: shockwavePos.current.x, y: shockwavePos.current.y, z: shockwavePos.current.z, radius: 12, strength: 28 })
    boids.avoidPoints = pts
    boids.update(delta)

    for (let i = 0; i < count; i++) {
      const group = groupRefs.current[i]
      if (!group) continue

      const ix = i * 3
      if (ix + 2 >= boids.positions.length) break
      
      group.position.set(boids.positions[ix], boids.positions[ix + 1], boids.positions[ix + 2])
      
      _dir.set(boids.velocities[ix], boids.velocities[ix + 1], boids.velocities[ix + 2])
      if (_dir.lengthSq() > 0.001) {
        _dir.normalize()
        _mat4.lookAt(group.position, group.position.clone().add(_dir), _up)
        _q.setFromRotationMatrix(_mat4)
        group.quaternion.copy(_q)
      }
      
      const s = baseScale * (0.85 + (i % 5) * 0.05)
      group.scale.setScalar(s)
    }
  })

  return (
    <group>
      {clones.map((clone, i) => (
        <AnimatedFish 
          key={i} 
          clone={clone} 
          animations={animations} 
          registerGroup={(el: THREE.Group) => (groupRefs.current[i] = el)} 
        />
      ))}
    </group>
  )
}

export default function FishSchool({ cursorPos, shockwavePos }: Props) {
  const { scene, animations } = useGLTF('/models/trout.glb')

  const boids1 = useMemo(() => new BoidsSimulation({ count: COUNT_A }), [])
  const boids2 = useMemo(() => new BoidsSimulation({ count: COUNT_B }), [])

  return (
    <>
      <School scene={scene} animations={animations} count={COUNT_A} palette={PALETTE_A} boids={boids1} cursorPos={cursorPos} shockwavePos={shockwavePos} />
      <School scene={scene} animations={animations} count={COUNT_B} palette={PALETTE_B} boids={boids2} cursorPos={cursorPos} shockwavePos={shockwavePos} />
    </>
  )
}
