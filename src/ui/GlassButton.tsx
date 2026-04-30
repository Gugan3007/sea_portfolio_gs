import { motion } from 'framer-motion'

/**
 * Frosted glass button with hover glow and micro-interactions.
 */
interface GlassButtonProps {
  label: string
  id: string
  onClick?: () => void
}

export default function GlassButton({ label, id, onClick }: GlassButtonProps) {
  return (
    <motion.button
      id={id}
      className="glass glass-button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="glass-button-text">{label}</span>
      <div className="glass-button-glow" />
    </motion.button>
  )
}
