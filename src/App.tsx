import { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import UnderwaterScene from './scene/UnderwaterScene'
import Overlay from './ui/Overlay'
import HtmlFishCursor from './cursor/HtmlFishCursor'

const prefersLowPower = () =>
  window.matchMedia('(max-width: 820px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches

export default function App() {
  const [lowPower, setLowPower] = useState(prefersLowPower)
  const [dpr, setDpr] = useState<[number, number]>(() => lowPower ? [0.75, 1.15] : [1, 1.6])
  const [ready, setReady] = useState(false)

  const onIncline = useCallback(() => setDpr(lowPower ? [0.75, 1.15] : [1, 1.6]), [lowPower])
  const onDecline = useCallback(() => setDpr(lowPower ? [0.7, 1] : [0.85, 1.2]), [lowPower])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 820px), (pointer: coarse), (prefers-reduced-motion: reduce)')
    const sync = () => {
      setLowPower(media.matches)
      setDpr(media.matches ? [0.75, 1.15] : [1, 1.6])
    }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
            antialias: !lowPower,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          frameloop="always"
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

      <HtmlFishCursor />
    </>
  )
}
