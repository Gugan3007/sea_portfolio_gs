/**
 * Procedural tail animation using sine wave.
 * Speed increases when mouse moves faster.
 */

export interface TailParams {
  time: number
  mouseSpeed: number
}

const BASE_FREQUENCY = 3.0
const SPEED_MULTIPLIER = 8.0
const BASE_AMPLITUDE = 0.35
const MAX_AMPLITUDE = 0.6

export function computeTailRotation({ time, mouseSpeed }: TailParams): number {
  const frequency = BASE_FREQUENCY + mouseSpeed * SPEED_MULTIPLIER
  const amplitude = Math.min(BASE_AMPLITUDE + mouseSpeed * 0.15, MAX_AMPLITUDE)
  return Math.sin(time * frequency) * amplitude
}

export function computeFinRotation(time: number, offset: number = 0): number {
  return Math.sin(time * 2.0 + offset) * 0.2
}

export function computeBodyWiggle(time: number, mouseSpeed: number): number {
  const freq = 2.0 + mouseSpeed * 4.0
  return Math.sin(time * freq) * 0.05
}
