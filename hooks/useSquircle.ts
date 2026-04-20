'use client'

// useSquircle — applies iOS-style continuous corners to any HTMLElement
// via `clip-path: path()`, computed dynamically from element size.
//
// Why runtime JS and not CSS `corner-shape`? That property isn't stably
// shipped in Chrome/Safari yet (still behind flags / WIP spec). This hook
// works in every modern browser today using SVG path math from
// figma-squircle (the same library Figma's blog post inspired).
//
// Cost: one ResizeObserver per element, one getSvgPath() call per resize.
// Cleanup on unmount. No flicker — clip-path applies in same frame as
// the initial measure.

import { useEffect, useRef } from 'react'
import { getSvgPath } from 'figma-squircle'

interface Options {
  /** Corner radius in pixels. Default 20. */
  cornerRadius?: number
  /** 0 (hard) → 1 (very soft). iOS default = 0.6. */
  cornerSmoothing?: number
}

export function useSquircle<T extends HTMLElement>({
  cornerRadius = 20,
  cornerSmoothing = 0.6,
}: Options = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const apply = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const path = getSvgPath({
        width,
        height,
        cornerRadius: Math.min(cornerRadius, Math.min(width, height) / 2),
        cornerSmoothing,
      })
      el.style.clipPath = `path('${path}')`
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cornerRadius, cornerSmoothing])

  return ref
}
