import { useEffect, useRef } from 'react'

export default function HtmlFishCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const media = window.matchMedia('(pointer: coarse)')
    if (media.matches) return

    let raf = 0
    let lastX = window.innerWidth / 2
    let lastY = window.innerHeight / 2
    let x = lastX
    let y = lastY
    let tx = x
    let ty = y
    let visible = false

    const tick = () => {
      x += (tx - x) * 0.35
      y += (ty - y) * 0.35

      const dx = x - lastX
      const dy = y - lastY
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      const speed = Math.min(Math.hypot(dx, dy) / 18, 1)

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-14px, -13px) rotate(${angle}deg) scale(${1 + speed * 0.12})`
      cursor.style.opacity = visible ? '1' : '0'

      lastX = x
      lastY = y
      raf = requestAnimationFrame(tick)
    }

    const setHoverState = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null
      const interactive = el?.closest('a, button, [role="button"], input, textarea, select')
      cursor.classList.toggle('is-hovering', Boolean(interactive))
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      tx = event.clientX
      ty = event.clientY
      visible = true
      cursor.classList.add('is-visible')
      setHoverState(event.target)
    }

    const onPointerLeave = () => {
      visible = false
      cursor.classList.remove('is-visible', 'is-hovering')
    }

    const onPointerDown = () => cursor.classList.add('is-clicking')
    const onPointerUp = () => cursor.classList.remove('is-clicking')

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <div ref={cursorRef} className="html-fish-cursor" aria-hidden="true">
      <span className="html-fish-tail" />
      <span className="html-fish-body">
        <span className="html-fish-eye" />
      </span>
      <span className="html-fish-fin" />
    </div>
  )
}
