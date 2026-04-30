/**
 * Lighting — corrected for underwater clarity.
 *
 * Key changes vs previous version:
 * - AmbientLight dropped from 0.9 → 0.18 (was washing everything bright cyan)
 * - Hemisphere intensity halved
 * - Sun directional reduced from 3.5 → 1.8
 * - Bioluminescent point lights kept but intensity lowered
 */
export default function Lighting() {
  return (
    <>
      {/* Distant sun rays penetrating from above — only mild fill */}
      <directionalLight
        position={[6, 40, 15]}
        intensity={1.8}
        color="#b8dfff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Secondary fill — subtle blue from front */}
      <directionalLight
        position={[0, 12, 20]}
        intensity={0.6}
        color="#7aaed4"
      />

      {/* Very dark ambient — deep ocean, not a bright room */}
      <ambientLight intensity={0.18} color="#0a1e3a" />

      {/* Hemisphere: dark sky blue above, very dark sand below */}
      <hemisphereLight args={['#091525', '#1a1205', 0.35]} />

      {/* Bioluminescent accent lights — subtle, colored, near seafloor */}
      <pointLight position={[-8,  0.5, -5]}  intensity={2.5} color="#00eecc" distance={14} decay={2} />
      <pointLight position={[10,  0.5,  4]}  intensity={2.0} color="#cc44ff" distance={12} decay={2} />
      <pointLight position={[ 0,  0.5, -10]} intensity={2.0} color="#44ff88" distance={12} decay={2} />
      <pointLight position={[-5,  0.5,  8]}  intensity={1.8} color="#6644ff" distance={12} decay={2} />
      <pointLight position={[14,  0.5, -8]}  intensity={1.6} color="#ffaa44" distance={11} decay={2} />
    </>
  )
}
