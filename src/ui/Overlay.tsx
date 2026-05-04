import { motion, AnimatePresence, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

const SECTIONS = ['Home', 'About', 'Experience', 'Projects', 'Contact'] as const
type Section = typeof SECTIONS[number]

const EXP = [
  {
    role: 'Software Development Engineer Intern',
    company: 'Bluestock Fintech',
    period: 'Sep 2025 - Oct 2025',
    desc: 'Contributed to core feature development and performance improvements. Debugged production code supporting customer-facing systems. Worked in an agile environment using Git workflows.',
  }
]

const EDU = [
  {
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'Amrita Vishwa Vidyapeetham',
    period: '2023 - 2027',
    desc: 'CGPA: 7.78. Focus on algorithmic problem-solving, AI-driven systems, and embedded projects. Active participation in technical clubs.',
  },
  {
    degree: 'Higher Secondary (12th Grade)',
    institution: 'The Indian Public School',
    period: '2022 - 2023',
    desc: 'Score: 87/100. Strong foundation in Mathematics and Computer Science. Served as School Cultural Secretary.',
  },
  {
    degree: 'Secondary (10th Grade)',
    institution: 'The Indian Public School',
    period: '2020 - 2021',
    desc: 'Score: 92/100. Completed secondary education with distinction. Active in extracurricular activities.',
  }
]

const PROJECTS = [
  { title: 'GS.motorx (Ongoing)', desc: 'Cinematic Automotive Service Platform – A next-gen smart vehicle concierge for cars and bikes with AI-powered predictive maintenance, gamification, and mechanic recommendations.', tech: ['AI', 'UI/UX', 'Automotive'], color: '#ff2255', github: 'https://github.com/Gugan3007/GS.motorx', demo: 'https://gs-motorx-6wnu7omw2-gugansaravanan3007-7078s-projects.vercel.app/dashboard' },
  { title: 'MyDr (Ongoing)', desc: 'AI-Powered Medical Diagnostic Platform. An enterprise-grade healthcare application featuring AI diagnostics and personalized health recommendations.', tech: ['AI', 'Healthcare', 'Enterprise'], color: '#00ff88', github: 'https://github.com/Gugan3007/Mr.Dr.', demo: 'https://mr-212pcey6m-gugansaravanan3007-7078s-projects.vercel.app' },
  { title: 'CareerLens', desc: 'AI-Powered Career Intelligence Platform. Helps college students and freshers navigate their journey with personalized resume scoring, skill gap analysis, and tailored roadmaps via Google Gemini.', tech: ['AI', 'Gemini', 'Platform'], color: '#9933ff', github: 'https://github.com/Gugan3007/CareerLens', demo: 'https://career-lens-n8ta.vercel.app/' },
  { title: 'Nexus Prime (Ongoing)', desc: 'Nexus Vendor Management Platform. Comprehensive system for managing vendor relations, comparing services, and optimizing supply chain operations.', tech: ['Next.js', 'Management', 'Platform'], color: '#ff8800', github: 'https://github.com/Gugan3007/nexus_prime', demo: 'https://nexus-prime-mm3v22og9-gugansaravanan3007-7078s-projects.vercel.app/compare' },
  { title: 'ColorCode - ASD Sensory-Safe UI', desc: 'A specialized application designed for children with Autism Spectrum Disorder (ASD). Implements a research-backed sensory-safe color system reducing visual noise.', tech: ['React', 'Accessibility', 'UX'], color: '#00ccff', github: 'https://github.com/Gugan3007/asd_colors-asd_game', demo: 'https://asd-colors-asd-game-tzuivbr1k-gugansaravanan3007-7078s-projects.vercel.app/game' },
  { title: 'Smart Irrigation System', desc: 'STM32-based automated irrigation system using soil moisture sensors, relay modules, and I2C LCD. Features auto/manual modes.', tech: ['STM32', 'C', 'Sensors'], color: '#22ff88', github: 'https://github.com/Gugan3007/Embedded_CaseStudy_Team12', demo: 'https://www.youtube.com/watch?si=9uT8pWuaGriyefTr&v=a2a_wdq3IO0&feature=youtu.be' },
  { title: 'Car Automation System', desc: 'Embedded C project implementing safety features like seat temp control, speed monitoring, tyre pressure & CO emission detection.', tech: ['Embedded C', 'Sensors'], color: '#ffcc44' },
  { title: 'Parama Edu', desc: 'E-Learning platform interface. Designed intuitive UI improving user engagement by 30% and reducing bounce rate by 15%.', tech: ['UI/UX', 'Frontend', 'API'], color: '#ff44cc', github: 'https://github.com/Gugan3007/ParamaEdu_Educational-Platform' },
  { title: 'StudSync', desc: 'Cross-platform Flutter app with Firebase. Modules for real-time attendance, events, holidays, and timetable management.', tech: ['Flutter', 'Firebase', 'Dart'], color: '#00ccff', github: 'https://github.com/Gugan3007/Stud-Sync', demo: 'https://drive.google.com/file/d/1RcVuT3FFzpmnVZ9i9zE2lDJwpjgLYp0_/view' },
  { title: 'Gugan MetaLab', desc: 'Modern, animated personal portfolio showcasing projects and skills with a clean, futuristic underwater aesthetic.', tech: ['React', 'TypeScript', 'Framer'], color: '#4488ff', demo: '#' },
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

const slideVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 120 : -120, // Slide from bottom if scrolling down
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -120 : 120, // Slide up out of view if scrolling down
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
}

export default function Overlay() {
  const [active, setActive] = useState<Section>('Home')
  const [dir, setDir] = useState<number>(1)
  const [vis, setVis] = useState(false)
  const { px, py } = useMouseParallax(16) // Added parallax to all panels

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 1000)
    return () => clearTimeout(t)
  }, [])

  // Sync active section to window for 3D Camera parallax
  useEffect(() => {
    (window as any).__activeSectionIndex = SECTIONS.indexOf(active);
  }, [active]);

  // ── Scroll to Navigate Sections ──
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: any;

    const handleWheel = (e: WheelEvent) => {
      // Ignore tiny trackpad movements to prevent accidental scrolls
      if (Math.abs(e.deltaY) < 30) return;

      if (isScrolling) return;
      isScrolling = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      setDir(direction);

      setActive(prevActive => {
        const currentIndex = SECTIONS.indexOf(prevActive);
        const nextIndex = currentIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < SECTIONS.length) {
          return SECTIONS[nextIndex];
        }
        return prevActive; // Reached end or beginning
      });
      
      // Cooldown before allowing another scroll
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 1500); 
    };

    // Add listener to the window
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleNavClick = (s: Section) => {
    const currentIndex = SECTIONS.indexOf(active);
    const nextIndex = SECTIONS.indexOf(s);
    setDir(nextIndex > currentIndex ? 1 : -1);
    setActive(s);
  }

  return (
    <>
      <div className="ui-layer" style={{ pointerEvents: 'none' }}>
        <AnimatePresence mode="wait" custom={dir}>

          {/* HOME */}
          {active === 'Home' && (
            <motion.div key="home" className="sec" custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit">
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
                  Detail-oriented CS undergraduate with strong foundations in data structures, algorithms, and full-stack development. Experienced in building scalable applications and embedded solutions.
                </motion.p>

                <motion.div className="home-btns"
                  initial={{ opacity: 0, y: 16 }}
                  animate={vis ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.4, duration: 0.8 }}
                >
                  <button id="btn-work"    className="btn-primary" style={{ pointerEvents: 'auto', cursor: 'none' }} onClick={() => handleNavClick('Projects')}>View My Work</button>
                  <button id="btn-contact" className="btn-ghost"   style={{ pointerEvents: 'auto', cursor: 'none' }} onClick={() => handleNavClick('Contact')}>Get In Touch</button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ABOUT */}
          {active === 'About' && (
            <motion.div key="about" className="sec" style={{ justifyContent: 'flex-start' }} custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit">
              <motion.div className="panel-wrap" style={{ x: px, y: py }}>
                <div className="glass-panel">
                  <h2 className="panel-heading">Who I Am & Skills</h2>
                  <p className="panel-body">
                    A Computer Science Engineering undergraduate (2023-2027) driven by curiosity to understand systems and build solutions. My interests span Data Structures, Systems Programming, and Web Development. I blend creativity with technical rigor, aiming for precision and continuous learning.
                  </p>
                  
                  <div style={{ marginTop: '1.2rem' }}>
                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Programming</p>
                    <div className="chips" style={{ marginBottom: '0.8rem' }}>
                      {['Python', 'C', 'C++', 'Java', 'JavaScript', 'HTML/CSS', 'Haskell', 'Dart'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>

                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Frameworks & Tools</p>
                    <div className="chips" style={{ marginBottom: '0.8rem' }}>
                      {['React', 'Flutter', 'Node.js', 'Git', 'VS Code', 'Excel', 'SQL', 'ChatGPT'].map(s => <span key={s} className="chip">{s}</span>)}
                    </div>

                    <p className="panel-body" style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Databases & Analytics</p>
                    <div className="chips" style={{ marginBottom: '0.8rem' }}>
                      {['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Pandas', 'NumPy', 'Matplotlib'].map(s => <span key={s} className="chip">{s}</span>)}
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
            <motion.div key="experience" className="sec" style={{ justifyContent: 'flex-start' }} custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit">
              <motion.div className="panel-wrap" style={{ x: px, y: py }}>
                <div className="glass-panel">
                  <h2 className="panel-heading">Experience & Education</h2>
                  <div className="timeline">
                    {EXP.map((e, i) => (
                      <motion.div key={`exp-${i}`} className="tl-item"
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
                    {EDU.map((e, i) => (
                      <motion.div key={`edu-${i}`} className="tl-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (EXP.length + i) * 0.12, duration: 0.55 }}
                      >
                        <div className="tl-dot" style={{ background: '#ffcc44', boxShadow: '0 0 8px #ffcc44' }} />
                        <span className="tl-period" style={{ color: '#ffcc44' }}>{e.period}</span>
                        <h3 className="tl-role">{e.degree}</h3>
                        <span className="tl-company">{e.institution}</span>
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
            <motion.div key="projects" className="projects-sec" custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit"
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
                      <div className="proj-links">
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="proj-link" style={{ color: p.color }}>⌨ GitHub</a>}
                        {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="proj-link" style={{ color: p.color }}>◈ {p.title === 'Gugan MetaLab' ? 'Live' : 'Demo'}</a>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CONTACT */}
          {active === 'Contact' && (
            <motion.div key="contact" className="sec" style={{ justifyContent: 'flex-start' }} custom={dir} variants={slideVariants} initial="initial" animate="animate" exit="exit">
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
                    <a id="link-github"   href="https://github.com/Gugan3007"   target="_blank" rel="noreferrer" className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">⌨</span> GitHub</a>
                    <a id="link-linkedin" href="https://linkedin.com/in/guganss" target="_blank" rel="noreferrer" className="contact-a" style={{ pointerEvents: 'auto', cursor: 'none' }}><span className="contact-icon">◈</span> LinkedIn</a>
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
            onClick={() => handleNavClick(s)}
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
