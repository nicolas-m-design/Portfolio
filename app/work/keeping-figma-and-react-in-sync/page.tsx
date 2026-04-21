// app/work/keeping-figma-and-react-in-sync/page.tsx
//
// Static, hand-authored case study that bypasses the Cosmic CMS.
// This file exists as a concrete sibling of the dynamic `[slug]/page.tsx`
// route; Next.js resolves static segments before dynamic ones, so this
// route wins for `/work/keeping-figma-and-react-in-sync` without disturbing any
// other Cosmic-fed project page.

import { Metadata } from 'next'
import { getAboutMe } from '@/lib/cosmic'
import Navigation from '@/components/Navigation'
import FactoryCaseStudy from './FactoryCaseStudy'

export const metadata: Metadata = {
  title: 'Keeping Figma and React in Sync with DESIGN.md – Nicolas Ménard',
  description:
    'A token-driven design system built in lockstep across Figma and React, where a single markdown contract lets AI agents do the execution without drift.',
  openGraph: {
    title: 'Keeping Figma and React in Sync with DESIGN.md – Nicolas Ménard',
    description:
      'A token-driven design system built in lockstep across Figma and React, where a single markdown contract lets AI agents do the execution without drift.',
    images: [
      {
        url: 'https://nicolasmenard.design/case-studies/factory-design-system/cover.png',
        width: 1200,
        height: 628,
        alt: 'Keeping Figma and React in Sync with DESIGN.md – cover image',
      },
    ],
  },
}

export default async function FactoryDesignSystemPage() {
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation aboutMe={aboutMe} />
      <main id="main-content" role="main">
        <FactoryCaseStudy />
      </main>
    </div>
  )
}
