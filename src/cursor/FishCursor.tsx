import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const _tgt = new THREE.Vector3()
const _prv = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _tqt = new THREE.Quaternion()
const _lmt = new THREE.Matrix4()
const _up  = new THREE.Vector3(0, 1, 0)
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
  const { camera, raycaster, pointer } = useThree()
  const plane = useRef(new THREE.Plane())

  useEffect(() => {
    const handlePointerDown = () => {
      if (group.current) onClick(group.current.position.clone())
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [onClick])

  useFrame(() => {
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

    const dx = p.x - _prv.x, dz = p.z - _prv.z
    _prv.copy(p)

    _dir.set(dx, 0, dz)
    if (_dir.lengthSq() > 0.0001) {
      _dir.normalize()
      _tgt.copy(p).add(_dir)
      _lmt.lookAt(p, _tgt, _up)
      _tqt.setFromRotationMatrix(_lmt)
      group.current.quaternion.slerp(_tqt, 0.08)
    }
  })

  return <group ref={group} visible={false} />
}
