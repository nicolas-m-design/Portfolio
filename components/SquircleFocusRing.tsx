'use client'

// SquircleFocusRing — renders an absolute-positioned SVG focus ring
// whose shape matches an iOS-style squircle. Works with any clip-path'd
// parent (the ring is drawn above content, not clipped).
//
// Usage: place as a direct child of a focusable element (a, button, etc).
// The parent must be `position: relative`. CSS reveals the ring when
// the parent matches `:focus-visible` via the `.squircle-focus-ring`
// class targeted in globals.css.

import { useEffect, useRef, useState } from 'react'
import { getSvgPath } from 'figma-squircle'

interface Props {
  /** Outward offset from parent border-box in px. Default 3. */
  offset?: number
  /** Corner radius of the parent element in px. Ring radius = this + offset. */
  cornerRadius?: number
  /** 0 (hard) → 1 (soft). Default 0.8. */
  cornerSmoothing?: number
  /** Ring stroke width in px. Default 2. */
  strokeWidth?: number
  /** Ring stroke color. Default Tailwind primary-500-ish blue. */
  color?: string
}

export default function SquircleFocusRing({
  offset = 3,
  cornerRadius = 28,
  cornerSmoothing = 0.8,
  strokeWidth = 2,
  color = '#2563eb',
}: Props) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ w: number; h: number; d: string }>({ w: 0, h: 0, d: '' })

  useEffect(() => {
    const anchor = anchorRef.current
    const parent = anchor?.parentElement
    if (!parent) return

    const compute = () => {
      const r = parent.getBoundingClientRect()
      if (!r.width || !r.height) return
      const w = r.width + offset * 2
      const h = r.height + offset * 2
      const maxR = Math.min(w, h) / 2
      const d = getSvgPath({
        width: w,
        height: h,
        cornerRadius: Math.min(cornerRadius + offset, maxR),
        cornerSmoothing,
      })
      setState({ w, h, d })
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [offset, cornerRadius, cornerSmoothing])

  return (
    <span
      ref={anchorRef}
      aria-hidden="true"
      className="squircle-focus-ring"
      style={{
        position: 'absolute',
        top: -offset,
        left: -offset,
        width: state.w || '100%',
        height: state.h || '100%',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 150ms ease',
      }}
    >
      {state.d && (
        <svg
          width={state.w}
          height={state.h}
          viewBox={`0 0 ${state.w} ${state.h}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <path d={state.d} fill="none" stroke={color} strokeWidth={strokeWidth} />
        </svg>
      )}
    </span>
  )
}
