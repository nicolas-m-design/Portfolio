// app/cv/page.tsx
//
// Route wrapper for /cv. Mirrors the Factory case-study pattern:
// metadata + nav shell + a sibling client component that renders the page.
//
// Variant (`de` | `ux`) is read from the ?variant= query param. `de` is the
// default because the Design Engineer repositioning is the primary goal; the
// UX variant is available via a toggle.
//
// noindex: /cv is intentionally not surfaced to search engines — it's meant
// to be shared by direct link in applications and outreach.

import type { Metadata } from 'next'
import { getAboutMe } from '@/lib/cosmic'
import Navigation from '@/components/Navigation'
import CurriculumVitae from './CurriculumVitae'
import type { CVVariant } from './types'

export const metadata: Metadata = {
  title: 'CV — Nicolas Ménard',
  description:
    'Design engineer and product designer with 10+ years shipping production UI across B2C, B2B SaaS, and AI products.',
  robots: { index: false, follow: true },
}

interface PageProps {
  searchParams?: Promise<{ variant?: string }>
}

function parseVariant(raw?: string): CVVariant {
  return raw === 'ux' ? 'ux' : 'de'
}

export default async function CVPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const variant = parseVariant(params.variant)
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation aboutMe={aboutMe} />
      <main id="main-content">
        <CurriculumVitae variant={variant} />
      </main>
    </div>
  )
}
