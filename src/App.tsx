import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import UnderwaterScene from './scene/UnderwaterScene'
import Overlay from './ui/Overlay'

export default function App() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2])
  const [ready, setReady] = useState(false)

  const onIncline = useCallback(() => setDpr([1, 2]), [])
  const onDecline = useCallback(() => setDpr([1, 1]), [])

  return (
    <>
      {/* ── Loading Screen ── */}
      <div className={`loading-screen${ready ? ' done' : ''}`}>
        <div className="load-bar-wrap"><div className="load-bar" /></div>
        <p className="load-label">Descending into the deep</p>
      </div>

      {/* ── 3D Canvas — fixed, full-viewport, behind UI ── */}
      <div className="canvas-wrap">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 8, 20], fov: 52, near: 0.1, far: 400 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          shadows
          onCreated={() => {
            setTimeout(() => setReady(true), 1400)
          }}
        >
          <PerformanceMonitor onIncline={onIncline} onDecline={onDecline}>
            <Suspense fallback={null}>
              <UnderwaterScene />
            </Suspense>
          </PerformanceMonitor>
        </Canvas>
      </div>

      {/* ── HTML UI — fixed, full-viewport, above canvas ── */}
      <div className="ui-layer">
        <Overlay />
      </div>
    </>
  )
}
