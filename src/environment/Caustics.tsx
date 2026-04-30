import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Caustics — very subtle shimmer.
 * Opacity severely reduced (was causing the white-cyan wash).
 */
function CausticPlane({ speed, scale, opacity }: { speed: number; scale: number; opacity: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uOpacity: { value: opacity },
  }), [opacity])

  const vert = /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `
  const frag = /* glsl */`
    uniform float uTime;
    uniform float uOpacity;
    varying vec2  vUv;
    float caustic(vec2 p, float t) {
      float c = 0.0;
      for (float i = 1.0; i < 5.0; i++) {
        p += vec2(sin(p.y*i + t*0.5 + i*0.4)*0.3, cos(p.x*i + t*0.4 + i*0.5)*0.3);
        c += 1.0 / length(vec2(sin(p.x + sin(p.y + t*0.25) + t*0.15), cos(p.y + cos(p.x + t*0.18) + t*0.1)));
      }
      return clamp(pow(c / 4.0, 2.2) * 0.25, 0.0, 1.0);
    }
    void main() {
      float c = caustic(vUv * ${scale.toFixed(1)}, uTime);
      gl_FragColor = vec4(0.3, 0.65, 1.0, c * uOpacity);
    }
  `

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta * speed
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]} renderOrder={1}>
      <planeGeometry args={[180, 180]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function CausticsEffect() {
  return (
    <>
      {/* Reduced opacities from 0.7/0.45 → 0.28/0.16 */}
      <CausticPlane speed={0.8} scale={5} opacity={0.28} />
      <CausticPlane speed={0.5} scale={7} opacity={0.16} />
    </>
  )
}
