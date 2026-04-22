'use client'

import { useEffect } from 'react'
import { AboutMe, Project } from '@/types'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

interface HomePageProps {
  aboutMe: AboutMe | null
  projects: Project[]
}

export default function HomePage({ aboutMe, projects }: HomePageProps) {
  useEffect(() => {
    // Handle anchor scrolling when page loads with hash
    const handleAnchorScroll = () => {
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1) // Remove the #
        const element = document.getElementById(sectionId)
        if (element) {
          // Small delay to ensure page is fully rendered
          setTimeout(() => {
            const headerHeight = 80 // Account for fixed header height
            const elementPosition = element.offsetTop - headerHeight
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            })
          }, 100)
        }
      }
    }

    // Run on initial load
    handleAnchorScroll()

    // Also run when hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleAnchorScroll)
    
    return () => {
      window.removeEventListener('hashchange', handleAnchorScroll)
    }
  }, [])

  return (
    <>
      <Hero aboutMe={aboutMe} />
      
      <Projects projects={projects} />

      <Contact aboutMe={aboutMe} />
    </>
  )
}