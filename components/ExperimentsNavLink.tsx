'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const STAR  = 'M0,-6 L1.2,-1.2 L6,0 L1.2,1.2 L0,6 L-1.2,1.2 L-6,0 L-1.2,-1.2 Z'
const BLEED = 32 // px canvas extends beyond link bounds

interface Spark {
  x: number; y: number
  initVx: number; initVy: number // initial velocity px/s
  size: number
  angle: number    // radians
  spin: number     // radians/s
  life: number // ms
  age: number  // ms
}

export default function ExperimentsNavLink() {
  const wrapRef   = useRef<HTMLSpanElement>(null)
  const linkRef   = useRef<HTMLAnchorElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks    = useRef<Spark[]>([])
  const raf       = useRef<number | null>(null)
  const lastTs    = useRef(0)
  const acc       = useRef(0)

  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx      = canvas.getContext('2d')!
    const starPath = new Path2D(STAR)

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect()
      canvas.width  = Math.round(width)  + BLEED * 2
      canvas.height = Math.round(height) + BLEED * 2
    }
    resize()

    const spawn = () => {
      const link     = linkRef.current
      const wrapRect = wrap.getBoundingClientRect()
      const linkRect = link ? link.getBoundingClientRect() : wrapRect

      // Full button area in canvas coords
      const xMin = BLEED + (linkRect.left - wrapRect.left)
      const xMax = BLEED + (linkRect.right - wrapRect.left)
      const yMin = BLEED + (linkRect.top - wrapRect.top)
      const yMax = BLEED + (linkRect.bottom - wrapRect.top)

      const x = xMin + Math.random() * (xMax - xMin)
      const y = yMin + Math.random() * (yMax - yMin)

      // All directions
      const angle = Math.random() * Math.PI * 2
      const speed = 20 + Math.random() * 30

      sparks.current.push({
        x, y,
        initVx: Math.cos(angle) * speed,
        initVy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 12,  // ±6 rad/s
        life: 600 + Math.random() * 400,
        age: 0,
      })
    }

    const RATE = 0.008 // sparks per ms ≈ 8/s
    const MAX  = 10

    const tick = (ts: number) => {
      const dt = Math.min(ts - lastTs.current, 50)
      lastTs.current = ts

      acc.current += RATE * dt
      while (acc.current >= 1) {
        acc.current -= 1
        if (sparks.current.length < MAX) spawn()
      }

      const s = dt / 1000
      sparks.current.forEach(p => {
        const t    = p.age / p.life
        const ease = Math.pow(1 - t, 2) // ease-out: fast start, decelerates to 0
        p.x     += p.initVx * ease * s
        p.y     += p.initVy * ease * s + 20 * t * s // gravity grows over time
        p.angle += p.spin * s
        p.age   += dt
      })
      sparks.current = sparks.current.filter(p => p.age < p.life)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks.current.forEach(p => {
        const t      = p.age / p.life
        const scale  = (1 - t) * p.size / 6  // shrinks to 0 over lifetime
        ctx.save()
        ctx.globalAlpha = 1
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.scale(scale, scale)
        ctx.fillStyle   = '#8F4CF2'
        ctx.fill(starPath)
        ctx.restore()
      })

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(ts => {
      lastTs.current = ts
      raf.current    = requestAnimationFrame(tick)
    })

    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  return (
    <span ref={wrapRef} className="relative hidden md:inline-block">
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{ left: -BLEED, top: -BLEED }}
      />
      <Link
        ref={linkRef}
        href="/experiments"
        className="nav-item relative text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full px-3 py-3 block"
        role="menuitem"
        aria-label="Navigate to Experiments page"
      >
        Experiments
      </Link>
    </span>
  )
}
