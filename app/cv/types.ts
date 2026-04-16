// app/cv/types.ts
//
// Typed schema for the CV/resume content. One source, two rendered variants:
// `de` (Design Engineer primary) and `ux` (Product/UX Designer fallback).
//
// Bullets may target one variant or both. The renderer filters by the active
// variant so the same file serves both audiences without manual duplication.

export type CVVariant = 'de' | 'ux'

export interface CVLink {
  label: string
  href: string
}

export interface CVBullet {
  /** The bullet text. Keep each bullet to ~1 line; lead with a verb. */
  text: string
  /** Restricts visibility to the listed variants. Undefined = both. */
  variants?: CVVariant[]
}

export interface CVRole {
  title: string
  company: string
  /** Optional short context sentence about the company, rendered as sub-heading. */
  context?: string
  location?: string
  /** Human-readable date range, e.g. "May 2023 – Apr 2025" or "Oct 2025 – Present". */
  dates: string
  /** Optional case-study link (shown as small inline pill). */
  caseStudy?: CVLink
  bullets: CVBullet[]
}

export interface CVSkillGroup {
  label: string
  items: string[]
  /** Skill groups can be pinned to the top in one variant and sunk in the other. */
  weight?: Partial<Record<CVVariant, number>>
}

export interface CVEducation {
  degree: string
  school: string
  location?: string
  dates: string
  detail?: string
}

export interface CVAward {
  title: string
  issuer?: string
  year?: string
}

export interface CVPublication {
  title: string
  venue?: string
  href?: string
}

export interface CV {
  name: string
  /** Shown big, under the name. Variant-specific. */
  headline: Record<CVVariant, string>
  /** Short one-paragraph bio. Variant-specific. */
  summary: Record<CVVariant, string>
  contact: {
    email: string
    phone?: string
    location: string
    legalStatus?: string
    links: CVLink[]
  }
  skills: CVSkillGroup[]
  experience: CVRole[]
  education: CVEducation[]
  awards?: CVAward[]
  certifications?: string[]
  publications?: CVPublication[]
  languages: string[]
  /** Used for an "also: climbing, running…" line. Optional. */
  interests?: string[]
}
