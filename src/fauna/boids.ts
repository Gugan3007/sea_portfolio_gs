/**
 * Boids Flocking Algorithm — Pure TypeScript, Zero GC
 * 
 * Uses pre-allocated Float32Arrays for all vector math.
 * Spatial grid partitioning for O(n) neighbor lookups.
 */

export interface BoidConfig {
  count: number
  bounds: { x: number; y: number; z: number }
  maxSpeed: number
  maxForce: number
  separationDist: number
  alignmentDist: number
  cohesionDist: number
  separationWeight: number
  alignmentWeight: number
  cohesionWeight: number
  avoidanceRadius: number
  avoidanceStrength: number
  boundaryForce: number
}

export const DEFAULT_BOID_CONFIG: BoidConfig = {
  count: 150,
  bounds: { x: 25, y: 8, z: 25 },
  maxSpeed: 4.0,
  maxForce: 0.15,
  separationDist: 1.5,
  alignmentDist: 3.0,
  cohesionDist: 4.0,
  separationWeight: 2.0,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  avoidanceRadius: 5.0,
  avoidanceStrength: 8.0,
  boundaryForce: 0.5,
}

export class BoidsSimulation {
  config: BoidConfig
  count: number

  // Flat arrays: [x0,y0,z0, x1,y1,z1, ...]
  positions: Float32Array
  velocities: Float32Array

  // Temp vectors (pre-allocated, reused each frame)
  private _sep = new Float32Array(3)
  private _ali = new Float32Array(3)
  private _coh = new Float32Array(3)
  private _steer = new Float32Array(3)

  // Spatial grid
  private gridSize: number
  private grid: Map<string, number[]> = new Map()

  // Avoidance points (cursor, click shockwaves)
  avoidPoints: { x: number; y: number; z: number; radius: number; strength: number }[] = []

  constructor(config: Partial<BoidConfig> = {}) {
    this.config = { ...DEFAULT_BOID_CONFIG, ...config }
    this.count = this.config.count
    this.gridSize = Math.max(this.config.alignmentDist, this.config.cohesionDist)

    this.positions = new Float32Array(this.count * 3)
    this.velocities = new Float32Array(this.count * 3)

    // Initialize random positions and velocities
    const { bounds } = this.config
    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      this.positions[idx] = (Math.random() - 0.5) * bounds.x * 1.5
      this.positions[idx + 1] = Math.random() * bounds.y * 0.6 + 1.5
      this.positions[idx + 2] = (Math.random() - 0.5) * bounds.z * 1.5

      this.velocities[idx] = (Math.random() - 0.5) * 2
      this.velocities[idx + 1] = (Math.random() - 0.5) * 0.5
      this.velocities[idx + 2] = (Math.random() - 0.5) * 2
    }
  }

  private cellKey(x: number, y: number, z: number): string {
    const gx = Math.floor(x / this.gridSize)
    const gy = Math.floor(y / this.gridSize)
    const gz = Math.floor(z / this.gridSize)
    return `${gx},${gy},${gz}`
  }

  private buildGrid(): void {
    this.grid.clear()
    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      const key = this.cellKey(
        this.positions[idx],
        this.positions[idx + 1],
        this.positions[idx + 2]
      )
      let cell = this.grid.get(key)
      if (!cell) {
        cell = []
        this.grid.set(key, cell)
      }
      cell.push(i)
    }
  }

  private getNeighborCells(x: number, y: number, z: number): number[] {
    const neighbors: number[] = []
    const gx = Math.floor(x / this.gridSize)
    const gy = Math.floor(y / this.gridSize)
    const gz = Math.floor(z / this.gridSize)

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${gx + dx},${gy + dy},${gz + dz}`
          const cell = this.grid.get(key)
          if (cell) {
            for (let k = 0; k < cell.length; k++) {
              neighbors.push(cell[k])
            }
          }
        }
      }
    }
    return neighbors
  }

  update(delta: number): void {
    const dt = Math.min(delta, 0.05) // Cap delta to prevent explosion
    this.buildGrid()

    const { maxSpeed, maxForce, separationDist, alignmentDist, cohesionDist } = this.config
    const { separationWeight, alignmentWeight, cohesionWeight, boundaryForce } = this.config
    const { bounds } = this.config

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      const px = this.positions[idx]
      const py = this.positions[idx + 1]
      const pz = this.positions[idx + 2]

      // Reset accumulators
      this._sep[0] = 0; this._sep[1] = 0; this._sep[2] = 0
      this._ali[0] = 0; this._ali[1] = 0; this._ali[2] = 0
      this._coh[0] = 0; this._coh[1] = 0; this._coh[2] = 0

      let sepCount = 0, aliCount = 0, cohCount = 0

      const neighbors = this.getNeighborCells(px, py, pz)

      for (let n = 0; n < neighbors.length; n++) {
        const j = neighbors[n]
        if (j === i) continue

        const jdx = j * 3
        const dx = px - this.positions[jdx]
        const dy = py - this.positions[jdx + 1]
        const dz = pz - this.positions[jdx + 2]
        const distSq = dx * dx + dy * dy + dz * dz

        // Separation
        if (distSq < separationDist * separationDist && distSq > 0.001) {
          const dist = Math.sqrt(distSq)
          this._sep[0] += dx / dist / dist
          this._sep[1] += dy / dist / dist
          this._sep[2] += dz / dist / dist
          sepCount++
        }

        // Alignment
        if (distSq < alignmentDist * alignmentDist) {
          this._ali[0] += this.velocities[jdx]
          this._ali[1] += this.velocities[jdx + 1]
          this._ali[2] += this.velocities[jdx + 2]
          aliCount++
        }

        // Cohesion
        if (distSq < cohesionDist * cohesionDist) {
          this._coh[0] += this.positions[jdx]
          this._coh[1] += this.positions[jdx + 1]
          this._coh[2] += this.positions[jdx + 2]
          cohCount++
        }
      }

      // Compute steering forces
      this._steer[0] = 0; this._steer[1] = 0; this._steer[2] = 0

      // Separation
      if (sepCount > 0) {
        this._sep[0] /= sepCount; this._sep[1] /= sepCount; this._sep[2] /= sepCount
        const sepMag = Math.sqrt(this._sep[0] ** 2 + this._sep[1] ** 2 + this._sep[2] ** 2)
        if (sepMag > 0) {
          this._steer[0] += (this._sep[0] / sepMag * maxSpeed - this.velocities[idx]) * separationWeight
          this._steer[1] += (this._sep[1] / sepMag * maxSpeed - this.velocities[idx + 1]) * separationWeight
          this._steer[2] += (this._sep[2] / sepMag * maxSpeed - this.velocities[idx + 2]) * separationWeight
        }
      }

      // Alignment
      if (aliCount > 0) {
        this._ali[0] /= aliCount; this._ali[1] /= aliCount; this._ali[2] /= aliCount
        const aliMag = Math.sqrt(this._ali[0] ** 2 + this._ali[1] ** 2 + this._ali[2] ** 2)
        if (aliMag > 0) {
          this._steer[0] += (this._ali[0] / aliMag * maxSpeed - this.velocities[idx]) * alignmentWeight
          this._steer[1] += (this._ali[1] / aliMag * maxSpeed - this.velocities[idx + 1]) * alignmentWeight
          this._steer[2] += (this._ali[2] / aliMag * maxSpeed - this.velocities[idx + 2]) * alignmentWeight
        }
      }

      // Cohesion
      if (cohCount > 0) {
        this._coh[0] = this._coh[0] / cohCount - px
        this._coh[1] = this._coh[1] / cohCount - py
        this._coh[2] = this._coh[2] / cohCount - pz
        const cohMag = Math.sqrt(this._coh[0] ** 2 + this._coh[1] ** 2 + this._coh[2] ** 2)
        if (cohMag > 0) {
          this._steer[0] += (this._coh[0] / cohMag * maxSpeed - this.velocities[idx]) * cohesionWeight
          this._steer[1] += (this._coh[1] / cohMag * maxSpeed - this.velocities[idx + 1]) * cohesionWeight
          this._steer[2] += (this._coh[2] / cohMag * maxSpeed - this.velocities[idx + 2]) * cohesionWeight
        }
      }

      // Avoidance (cursor, shockwaves)
      for (let a = 0; a < this.avoidPoints.length; a++) {
        const ap = this.avoidPoints[a]
        const adx = px - ap.x
        const ady = py - ap.y
        const adz = pz - ap.z
        const adist = Math.sqrt(adx * adx + ady * ady + adz * adz)
        if (adist < ap.radius && adist > 0.01) {
          const force = (1 - adist / ap.radius) * ap.strength
          this._steer[0] += (adx / adist) * force
          this._steer[1] += (ady / adist) * force
          this._steer[2] += (adz / adist) * force
        }
      }

      // Boundary forces (soft wrap)
      if (px > bounds.x) this._steer[0] -= boundaryForce * (px - bounds.x)
      if (px < -bounds.x) this._steer[0] -= boundaryForce * (px + bounds.x)
      if (py > bounds.y + 2) this._steer[1] -= boundaryForce * (py - bounds.y - 2)
      if (py < 0.5) this._steer[1] += boundaryForce * (0.5 - py)
      if (pz > bounds.z) this._steer[2] -= boundaryForce * (pz - bounds.z)
      if (pz < -bounds.z) this._steer[2] -= boundaryForce * (pz + bounds.z)

      // Clamp force
      const forceMag = Math.sqrt(this._steer[0] ** 2 + this._steer[1] ** 2 + this._steer[2] ** 2)
      if (forceMag > maxForce) {
        const scale = maxForce / forceMag
        this._steer[0] *= scale
        this._steer[1] *= scale
        this._steer[2] *= scale
      }

      // Apply force to velocity
      this.velocities[idx] += this._steer[0] * dt * 60
      this.velocities[idx + 1] += this._steer[1] * dt * 60
      this.velocities[idx + 2] += this._steer[2] * dt * 60

      // Clamp speed
      const speed = Math.sqrt(
        this.velocities[idx] ** 2 +
        this.velocities[idx + 1] ** 2 +
        this.velocities[idx + 2] ** 2
      )
      if (speed > maxSpeed) {
        const s = maxSpeed / speed
        this.velocities[idx] *= s
        this.velocities[idx + 1] *= s
        this.velocities[idx + 2] *= s
      }

      // Minimum speed (fish don't stop)
      if (speed < maxSpeed * 0.3) {
        const s = (maxSpeed * 0.3) / Math.max(speed, 0.01)
        this.velocities[idx] *= s
        this.velocities[idx + 1] *= s
        this.velocities[idx + 2] *= s
      }

      // Update position
      this.positions[idx] += this.velocities[idx] * dt
      this.positions[idx + 1] += this.velocities[idx + 1] * dt
      this.positions[idx + 2] += this.velocities[idx + 2] * dt
    }
  }
}
