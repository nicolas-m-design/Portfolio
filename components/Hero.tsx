'use client'

import { AboutMe } from '@/types'
import WaveMesh from '@/components/WaveMesh'

const SHOW_WAVE_MESH = true

interface HeroProps {
  aboutMe: AboutMe | null
}

export default function Hero({ aboutMe }: HeroProps) {
  return (
    <section
      className="h-screen md:h-[90vh] flex items-center justify-center relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-0"
      role="banner"
      aria-label="Hero section introducing Nicolas Ménard"
    >
      <div className="absolute inset-0 bg-gray-50 dark:bg-black" />

      <div className="container relative z-10 pointer-events-none md:-translate-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 md:gap-16">
          {SHOW_WAVE_MESH && (
            <div className="w-4/5 mx-auto aspect-[4/3] md:w-[400px] md:h-[400px] md:order-2 md:flex-shrink-0 md:aspect-auto md:mx-0 md:ml-8">
              <WaveMesh />
            </div>
          )}

          <div className="flex-1 md:order-1 md:max-w-xl lg:max-w-2xl px-4 md:px-0 text-center md:text-left">
            <h1
              className="text-xl md:text-2xl lg:text-3xl mb-6 font-medium leading-tight text-[#2F3437] dark:text-gray-100"
              style={{
                fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              Engineering mindset,<br className="md:hidden" /> user-focused heart
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-[#787774] dark:text-gray-400">
              I&rsquo;m a results-driven designer who specializes in solving
              complex product challenges, with proven experience leading teams
              and conducting user research.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={() => {
            const workSection = document.getElementById('work')
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="flex flex-col items-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md p-2 text-[#787774] dark:text-gray-500"
          aria-label="Scroll to work section"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}
