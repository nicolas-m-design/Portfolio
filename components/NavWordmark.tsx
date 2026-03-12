'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const TEXT = 'Nicolas Ménard'

// bw preset config (matches animated-wordmark monochrome preset)
const CFG = {
  baseWeight:    500,
  peakWeight:    700,
  waveRadius:    3.0,
  colorRadius:   1.8,
  loopDuration:  3100,
  tailFraction:  0.15,
  valleyColor:   [255, 255, 255] as [number, number, number],
  baseColor:     [255, 255, 255] as [number, number, number],
  peakColor:     [255, 255, 255] as [number, number, number],
  peakPeakColor: [255, 255, 255] as [number, number, number],
}

const gaussian = (t: number) => Math.exp(-4 * t * t)
const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t)) as [number, number, number]

export default function NavWordmark() {
  const containerRef = useRef<HTMLSpanElement>(null)
  const spansRef     = useRef<HTMLSpanElement[]>([])
  const rafRef       = useRef<number | null>(null)
  const t0Ref        = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Build one inline-block span per character
    container.innerHTML = ''
    spansRef.current = []
    ;[...TEXT].forEach(char => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00a0' : char
      span.style.display              = 'inline-block'
      span.style.fontFamily           = "'Space Grotesk', sans-serif"
      span.style.fontVariationSettings = `'wght' ${CFG.baseWeight}`
      span.style.color                = `rgb(${CFG.valleyColor.join(',')})`
      span.style.textAlign            = 'center'
      container.appendChild(span)
      spansRef.current.push(span)
    })

    // Probe each character's width at baseWeight so bolding never causes layout shift
    const fontSize = getComputedStyle(container).fontSize

    const probe = (char: string) => {
      const s = document.createElement('span')
      s.style.cssText =
        `font-family:'Space Grotesk',sans-serif;` +
        `font-size:${fontSize};` +
        `font-variation-settings:'wght' ${CFG.baseWeight};` +
        `position:absolute;visibility:hidden;white-space:nowrap;line-height:1;`
      s.textContent = char === ' ' ? '\u00a0' : char
      document.body.appendChild(s)
      const w = s.getBoundingClientRect().width
      document.body.removeChild(s)
      return w
    }

    const setWidths = () => {
      spansRef.current.forEach(span => {
        span.style.width = `${probe(span.textContent!)}px`
      })
    }

    // Wait for font to load before probing
    document.fonts.ready.then(setWidths)

    // Animation loop
    const tick = (now: number) => {
      if (t0Ref.current === null) t0Ref.current = now

      const n = spansRef.current.length
      if (n === 0) { rafRef.current = requestAnimationFrame(tick); return }

      const { loopDuration, tailFraction, colorRadius, waveRadius } = CFG
      const t       = ((now - t0Ref.current) % loopDuration) / loopDuration
      const travelT = Math.min(t / (1 - tailFraction), 1)
      const pos     = -colorRadius + travelT * (n - 1 + 2 * colorRadius)

      const enterDist  = pos - (-colorRadius)
      const exitDist   = (n - 1 + colorRadius) - pos
      const globalFade = Math.max(0, Math.min(Math.min(enterDist, exitDist) / (colorRadius * 0.8), 1))

      for (let i = 0; i < n; i++) {
        const dist      = Math.abs(i - pos)
        const weightInf = dist / waveRadius  <= 1 ? gaussian(dist / waveRadius)  : 0
        const colorInf  = dist / colorRadius <= 1 ? gaussian(dist / colorRadius) : 0

        const w       = CFG.baseWeight + (CFG.peakWeight - CFG.baseWeight) * weightInf
        const valleyT = Math.max(0, 1 - colorInf * 3)
        const baseRgb = lerp3(CFG.valleyColor, CFG.baseColor, 1 - valleyT)
        const midRgb  = lerp3(baseRgb, CFG.peakColor, colorInf * globalFade)
        const rgb     = lerp3(midRgb, CFG.peakPeakColor, weightInf * globalFade)

        spansRef.current[i].style.fontVariationSettings = `'wght' ${w.toFixed(1)}`
        spansRef.current[i].style.color = `rgb(${rgb.join(',')})`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <Link
      href="/"
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
      aria-label="Navigate to home page"
    >
      <span
        ref={containerRef}
        aria-hidden="true"
        style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1 }}
      />
      <span className="sr-only">{TEXT}</span>
    </Link>
  )
}
