import { EffectComposer, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

/**
 * PostProcessing: COMPLETELY DISABLED.
 * The user requested absolute sharpness.
 * Any lens effect or chromatic aberration was perceived as blur.
 */
export default function PostProcessing() {
  return null
}
