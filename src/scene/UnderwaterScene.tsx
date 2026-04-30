import { useRef, useCallback, Suspense } from 'react'
import * as THREE from 'three'

// ── Environment ──
import Seabed          from '../environment/Seabed'
import CausticsEffect  from '../environment/Caustics'
import Rocks           from '../environment/Rocks'
import Corals          from '../environment/Corals'
import Seagrass        from '../environment/Seagrass'
import SeaUrchin       from '../environment/SeaUrchin'
import BubbleParticles from '../environment/BubbleParticles'
import GodRays         from '../environment/GodRays'

// ── Fauna ──
import FishSchool  from '../fauna/FishSchool'
import NemoSchool  from '../fauna/NemoSchool'
import PredatorFish from '../fauna/PredatorFish'
import SeaTurtle   from '../fauna/SeaTurtle'
import Jellyfish   from '../fauna/Jellyfish'
import Seahorse    from '../fauna/Seahorse'
import EagleRay    from '../fauna/EagleRay'

// ── Cursor ──
import FishCursor  from '../cursor/FishCursor'
import Shockwave   from '../cursor/Shockwave'

// ── Scene helpers ──
import Lighting      from './Lighting'
import CameraRig     from './CameraRig'
import PostProcessing from './PostProcessing'
import MarineSnow    from './MarineSnow'

export default function UnderwaterScene() {
  const cursorPos    = useRef(new THREE.Vector3())
  const shockwavePos = useRef<THREE.Vector3 | null>(null)

  const handleClick = useCallback((pos: THREE.Vector3) => {
    if ((window as any).__triggerShockwave) (window as any).__triggerShockwave(pos)
  }, [])

  return (
    <>
      <fogExp2 attach="fog" args={['#010f1a', 0.016]} />
      <color   attach="background" args={['#010f1a']} />

      <Lighting />
      <CameraRig />

      {/* Atmosphere */}
      <MarineSnow />
      <BubbleParticles />
      <GodRays />

      {/* Seabed */}
      <Seabed />
      <CausticsEffect />

      {/* ── Seabed environment ── */}
      <Suspense fallback={null}><Rocks /></Suspense>
      <Suspense fallback={null}><Corals /></Suspense>
      <Suspense fallback={null}><Seagrass /></Suspense>
      <Suspense fallback={null}><SeaUrchin /></Suspense>

      {/* ── Fauna ── */}
      {/* Main boid schools — fish2.glb in two color groups */}
      <Suspense fallback={null}>
        <FishSchool cursorPos={cursorPos} shockwavePos={shockwavePos} />
      </Suspense>

      {/* Nemo family — cute tight orange group */}
      <Suspense fallback={null}><NemoSchool /></Suspense>

      {/* Large predators */}
      <Suspense fallback={null}><PredatorFish /></Suspense>

      {/* Calm swimmers */}
      <Suspense fallback={null}><SeaTurtle /></Suspense>
      <Suspense fallback={null}><Jellyfish /></Suspense>

      {/* Decorative fauna */}
      <Suspense fallback={null}><Seahorse /></Suspense>
      <Suspense fallback={null}><EagleRay /></Suspense>

      {/* Interactive cursor */}
      <Suspense fallback={null}>
        <FishCursor cursorPos={cursorPos} onClick={handleClick} />
      </Suspense>
      <Shockwave shockwavePos={shockwavePos} />

      <PostProcessing />
    </>
  )
}
