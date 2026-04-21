'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="nav-item-light rounded-md p-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      role="switch"
      aria-checked={isDark}
    >
      <span className="relative block w-5 h-5" aria-hidden="true">
        <Sun
          size={20}
          weight="regular"
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 pointer-events-none'
          }`}
        />
        <Moon
          size={20}
          weight="regular"
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-0 -rotate-90 pointer-events-none' : 'opacity-100 rotate-0'
          }`}
        />
      </span>
    </button>
  )
}
