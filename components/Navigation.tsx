'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AboutMe } from '@/types'
import ExperimentsNavLink from './ExperimentsNavLink'
import NavWordmark from './NavWordmark'

interface NavigationProps {
  aboutMe?: AboutMe | null
}

export default function Navigation({ aboutMe }: NavigationProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const handleNavigation = (sectionId: string) => {
    // Check if we're on the homepage
    if (pathname === '/') {
      // We're on homepage, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        const headerHeight = 80 // Account for fixed header height
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    } else {
      // We're on another page (like ProjectDetail), redirect to homepage with anchor
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-50" role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto rounded-full py-3.5 bg-black/90 backdrop-blur-lg border border-gray-800/50">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <NavWordmark />

              <div className="flex items-center gap-1 font-medium text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }} role="menubar" aria-label="Main menu">
                <button
                  onClick={() => handleNavigation('work')}
                  className="nav-item hidden md:block text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full px-3 py-3"
                  role="menuitem"
                  aria-label="Navigate to Projects section"
                >
                  Projects
                </button>
                <button
                  onClick={() => handleNavigation('contact')}
                  className="nav-item hidden md:block text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full px-3 py-3"
                  role="menuitem"
                  aria-label="Navigate to About me section"
                >
                  About me
                </button>
                <ExperimentsNavLink />
                <Link
                  href="/cv"
                  className="nav-item text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full px-3 py-3"
                  role="menuitem"
                  aria-label="View CV"
                >
                  Resume
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}