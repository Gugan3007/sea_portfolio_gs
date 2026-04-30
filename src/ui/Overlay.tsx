import { motion, AnimatePresence, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

const SECTIONS = ['Home', 'About', 'Experience', 'Projects', 'Contact'] as const
type Section = typeof SECTIONS[number]

const EXP = [
  {
    role: 'Software Development Engineer Intern',
    company: 'Bluestock Fintech',
    period: 'Sep 2025 - Oct 2025',
    desc: 'Contributed to core feature development and performance improvements. Debugged production code for customer-facing systems. Worked in an Agile environment using Git workflows.',
  }
]

const PROJECTS = [
  { title: 'StudSync',  desc: 'Student Management Platform. Lead Developer. Cross-platform Flutter app with Firebase. Real-time attendance, timetable management, and dynamic staff status.', tech: ['Flutter', 'Dart', 'Firebase'], color: '#00ccff' },
  { title: 'Smart Irrigation System', desc: 'Embedded Developer. STM32-based setup using soil moisture sensor, relay-driven motor, and I2C LCD. Auto/Manual modes.', tech: ['STM32', 'C', 'I2C', 'Sensors'], color: '#22ff88' },
  { title: 'Car Automation System', desc: 'Embedded Systems Developer. Safety modules including seat temp control, speed monitoring, tyre pressure, CO emission detection, SOS alerts.', tech: ['Embedded C', 'Sensors'], color: '#ffcc44' },
  { title: 'ParamaEdu', desc: 'Online Learning Platform: Frontend Developer. Designed intuitive, responsive interface improving user engagement by 30%.', tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'], color: '#ff44cc' },
  { title: 'Living Ocean Portfolio', desc: 'Personal Portfolio: The current interactive 3D underwater ecosystem site.', tech: ['React', 'TypeScript', 'R3F', 'Framer Motion'], color: '#4488ff' },
]

function useMouseParallax(strength = 14): { px: MotionValue<number>; py: MotionValue<number> } {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [0, window.innerWidth],  [ strength, -strength]), { stiffness: 40, damping: 22 })
  const py = useSpring(useTransform(my, [0, window.innerHeight], [ strength * 0.6, -strength * 0.6]), { stiffness: 40, damping: 22 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return { px, py }
}

const panelVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
}
const homeVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -30 },
}
const transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

export default function Overlay() {
  const [active, setActive] = useState<Section>('Home')
  const [vis, setVis] = useState(false)
  const { px, py } = useMouseParallax(16) // Added parallax to all panels

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div className="ui-layer" style={{ pointerEvents: 'none' }}>
        <AnimatePresence mode="wait">

          {/* HOME */}
          {active === 'Home' && (
            <motion.div key="home" className="sec" variants={homeVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <motion.div className="home-inner" style={{ x: px, y: py }}>
                <motion.p className="home-eyebrow"
                  initial={{ opacity: 0, letterSpacing: '0.6em' }}
                  animate={vis ? { opacity: 1, letterSpacing: '0.45em' } : {}}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  Full Stack Developer & Systems Programmer
                </motion.p>

                <motion.h1 className="home-name"
                  initial={{ opacity: 0, y: 15 }}
                  animate={vis ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                >
                  Gugan <span>Saravanan</span>
                </motion.h1>

                <motion.p className="home-sub"
                  initial={{ opacity: 0 }}
                  animate={vis ? { opacity: 1 } : {}}
                  transition={{ delay: 1.0, duration: 0.9 }}
                >
                  Passionate about building innovative solutions through systems programming, web development, and AI-driven automation. Currently pursuing B.Tech in CSE at Amrita Vishwa Vidyapeetham, Coimbatore.
                </motion.p>

                <motion.div className="home-btns"
                  initial={{ opacity: 0, y: 16 }}
                  animate={vis ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.4, duration: 0.8 }}
                >
                  <button id="btn-work"    className="btn-primary" style={{ pointerEvents: 'auto', cursor: 'none' }} onClick={() => setActive('Projects')}>View My Work</button>
                  <button id="btn-contact" className="btn-ghost"   style={{ pointerEvents: 'auto', cursor: 'none' }} onClick={() => setActive('Contact')}>Get In Touch</button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ABOUT */}
          {active === 'About' && (
            <motion.div key="about" className="sec" style={{ justifyContent: 'flex-start' }} variants={panelVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <motion.div className="panel-wrap" style={{ x: px, y: py }}>
                <div className="glass-panel">
                  <h2 className="panel-heading">Who I Am & Skills</h2>
                  <p className="panel-body">
                    A Computer Science Engineering undergraduate (2023-2027) driven by curiosity to understand systems and build solutions. My interests span Data Structures, Systems Programming, and Web Development. I blend creativity with technical rigor, aiming for precision and continuous learning.
                  </p>
                  
                  <div style={{ marginTop: '1.2rem' }}>
                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Programming</p>
                    <div className="chips" style={{ marginBottom: '1rem' }}>
                      {['Python', 'C', 'C++', 'Java', 'JavaScript', 'HTML/CSS', 'Haskell', 'Dart'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>

                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frameworks</p>
                    <div className="chips" style={{ marginBottom: '1rem' }}>
                      {['React', 'Flutter', 'Node.js', 'Tailwind CSS', 'Framer Motion'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>

                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Databases</p>
                    <div className="chips" style={{ marginBottom: '1rem' }}>
                      {['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>

                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Domains</p>
                    <div className="chips">
                      {['Operating Systems', 'Computer Networks', 'Embedded Systems', 'Machine Learning'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* EXPERIENCE */}
          {active === 'Experience' && (
            <motion.div key="experience" className="sec" style={{ justifyContent: 'flex-start' }} variants={panelVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <motion.div className="panel-wrap" style={{ x: px, y: py }}>
                <div className="glass-panel">
                  <h2 className="panel-heading">Experience</h2>
                  <div className="timeline">
                    {EXP.map((e, i) => (
                      <motion.div key={i} className="tl-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.55 }}
                      >
                        <div className="tl-dot" />
                        <span className="tl-period">{e.period}</span>
                        <h3 className="tl-role">{e.role}</h3>
                        <span className="tl-company">{e.company}</span>
                        <p className="tl-desc">{e.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* PROJECTS */}
          {active === 'Projects' && (
            <motion.div key="projects" className="projects-sec" variants={homeVariants} initial="initial" animate="animate" exit="exit" transition={transition}
              style={{ pointerEvents: 'auto' }}
            >
              <motion.div style={{ x: px, y: py }}>
                <h2 className="projects-heading">Selected Projects</h2>
                <div className="proj-grid">
                  {PROJECTS.map((p, i) => (
                    <motion.div key={i} id={`proj-${i}`} className="proj-card"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09, duration: 0.55 }}
                      style={{ '--accent': p.color } as React.CSSProperties}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className="proj-accent" style={{ background: p.color, boxShadow: `0 0 12px ${p.color}` }} />
                      <h3 className="proj-title">{p.title}</h3>
                      <p className="proj-desc">{p.desc}</p>
                      <div className="proj-tags">
                        {p.tech.map(t => <span key={t} className="proj-tag" style={{ color: p.color }}>{t}</span>)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CONTACT */}
          {active === 'Contact' && (
            <motion.div key="contact" className="sec" style={{ justifyContent: 'flex-start' }} variants={panelVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
              <motion.div className="panel-wrap" style={{ x: px, y: py }}>
                <div className="glass-panel">
                  <h2 className="panel-heading">Let's Connect</h2>
                  <p className="panel-body">
                    Open to exciting opportunities, collaborations, and interesting projects.
                    Drop me a message — I respond fast.
                  </p>
                  <div className="contact-links">
                    <a id="link-email"    href="mailto:gugansaravanan3007@gmail.com"      className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">✉</span> gugansaravanan3007@gmail.com</a>
                    <a id="link-phone"    href="tel:+919150158370"                        className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">✆</span> +91 9150158370</a>
                    <a id="link-location" href="#"                                        className="contact-a" style={{ pointerEvents: 'auto', cursor: 'default' }}><span className="contact-icon">⚲</span> Coimbatore, Tamil Nadu, India</a>
                    <a id="link-github"   href="https://github.com"   target="_blank" rel="noreferrer" className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">⌨</span> GitHub</a>
                    <a id="link-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">◈</span> LinkedIn</a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Nav Dots ── */}
      <nav className="nav-dots" aria-label="Portfolio sections">
        {SECTIONS.map(s => (
          <button
            key={s}
            id={`nav-${s.toLowerCase()}`}
            className={`nav-dot-btn${active === s ? ' active' : ''}`}
            onClick={() => setActive(s)}
            title={s}
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            <div className="nav-dot-circle" />
            <span className="nav-dot-tip">{s}</span>
          </button>
        ))}
      </nav>

      {/* ── Signature ── */}
      <p className="sig">by GS</p>
    </>
  )
}
