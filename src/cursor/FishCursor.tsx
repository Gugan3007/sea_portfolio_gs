import { useRef, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/goldfish.glb')

const _tgt = new THREE.Vector3()
const _prv = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _tqt = new THREE.Quaternion()
const _lmt = new THREE.Matrix4()
const _up  = new THREE.Vector3(0, 1, 0)
const _box = new THREE.Box3()
const _siz = new THREE.Vector3()
const _camDir = new THREE.Vector3()
const _planePoint = new THREE.Vector3()
const _hit = new THREE.Vector3()

interface Props {
  cursorPos: React.MutableRefObject<THREE.Vector3>
  onClick: (pos: THREE.Vector3) => void
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export default function FishCursor({ cursorPos, onClick }: Props) {
  const group = useRef<THREE.Group>(null)
  const speedRef = useRef(0)
  const { camera, raycaster, pointer } = useThree()
  const plane = useRef(new THREE.Plane())

  const { scene, animations } = useGLTF('/models/goldfish.glb')
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh
        mesh.renderOrder = 999
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          materials.forEach((material) => {
            material.depthTest = false
            material.depthWrite = false
            material.needsUpdate = true
          })
        }
      }
    })
    return clone
  }, [scene])
  const { actions, names } = useAnimations(animations, group)

  // ── Auto-scale: normalize to 1.3 world units (clearly visible, not huge) ──
  const normalizedScale = useMemo(() => {
    _box.setFromObject(clonedScene)
    _box.getSize(_siz)
    const maxDim = Math.max(_siz.x, _siz.y, _siz.z)
    return maxDim > 0 ? 1.3 / maxDim : 0.8
  }, [clonedScene])

  useMemo(() => {
    if (names.length > 0) {
      const a = actions[names[0]]
      if (a) { a.reset().play(); a.timeScale = 1.2 }
    }
  }, [actions, names])

  useFrame((_, delta) => {
    if (!group.current) return

    raycaster.setFromCamera(pointer, camera)
    camera.getWorldDirection(_camDir)
    _planePoint.copy(camera.position).addScaledVector(_camDir, 6)
    plane.current.setFromNormalAndCoplanarPoint(
      _camDir,
      _planePoint
    )
    if (!raycaster.ray.intersectPlane(plane.current, _hit)) return
    _tgt.copy(_hit)

    const p = group.current.position
    p.x = lerp(p.x, _tgt.x, 0.09)
    p.y = lerp(p.y, _tgt.y, 0.09)
    p.z = lerp(p.z, _tgt.z, 0.09)
    cursorPos.current.copy(p)

    const dx = p.x - _prv.x, dy = p.y - _prv.y, dz = p.z - _prv.z
    const spd = Math.sqrt(dx*dx + dy*dy + dz*dz) / Math.max(delta, 0.001)
    speedRef.current = lerp(speedRef.current, Math.min(spd * 0.03, 1), 0.1)
    _prv.copy(p)

    // Only use X and Z for rotation direction so the fish never pitches up or down
    _dir.set(dx, 0, dz)
    if (_dir.lengthSq() > 0.0001) {
      _dir.normalize()
      _tgt.copy(p).add(_dir)
      _lmt.lookAt(p, _tgt, _up)
      _tqt.setFromRotationMatrix(_lmt)
      group.current.quaternion.slerp(_tqt, 0.08)
    }

    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]!.timeScale = 0.7 + speedRef.current * 2.5
    }
  })

  const handleClick = useCallback(() => {
    if (group.current) onClick(group.current.position.clone())
  }, [onClick])

  return (
    <group ref={group} scale={[normalizedScale, normalizedScale, normalizedScale]} renderOrder={999} onClick={handleClick}>
      {/* Orange-gold glow — clearly distinguishes cursor from other fish */}
      <pointLight color="#ffb13d" intensity={8} distance={12} decay={2} />
      <primitive object={clonedScene} />
    </group>
  )
}
