'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AboutMe } from '@/types'
import ExperimentsNavLink from './ExperimentsNavLink'
import NavWordmark from './NavWordmark'
import ThemeToggle from './ThemeToggle'
import SquircleFocusRing from './SquircleFocusRing'

interface NavigationProps {
  aboutMe?: AboutMe | null
}

export default function Navigation({ aboutMe }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        const headerHeight = 64
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({ top: elementPosition, behavior: 'smooth' })
      }
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300',
        scrolled
          ? 'backdrop-blur-lg border-b border-gray-300 dark:border-gray-800 dark:bg-black/80'
          : 'border-b border-transparent',
      ].join(' ')}
      role="banner"
    >
      <nav role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <NavWordmark />

          <div
            className="flex items-center gap-1 text-sm font-medium"
            style={{ fontFamily: "'PP Neue Montreal', ui-sans-serif, system-ui, sans-serif" }}
            aria-label="Main menu"
          >
            <button
              onClick={() => handleNavigation('work')}
              className="nav-item-light relative hidden md:block rounded-md px-3 py-2"
              aria-label="Navigate to Projects section"
            >
              Projects
              <SquircleFocusRing cornerRadius={8} cornerSmoothing={0.8} offset={2} strokeWidth={2} />
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className="nav-item-light relative hidden md:block rounded-md px-3 py-2"
              aria-label="Navigate to About me section"
            >
              About me
              <SquircleFocusRing cornerRadius={8} cornerSmoothing={0.8} offset={2} strokeWidth={2} />
            </button>
            <ExperimentsNavLink />
            <Link
              href="/cv"
              className="nav-item-light relative rounded-md px-3 py-2"
              aria-label="View CV"
              tabIndex={0}
            >
              Resume
              <SquircleFocusRing cornerRadius={8} cornerSmoothing={0.8} offset={2} strokeWidth={2} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
