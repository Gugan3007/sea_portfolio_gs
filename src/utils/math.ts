/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Clamp a value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/** Remap a value from one range to another */
export const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)

/** Smooth step interpolation */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Random float in range */
export const randomRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min

/** Ease out cubic */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)
