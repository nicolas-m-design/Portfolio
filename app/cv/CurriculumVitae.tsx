// app/cv/CurriculumVitae.tsx
//
// Redesigned CV renderer — Swiss editorial, 2-column layout.
//
// Screen: sticky left sidebar (name / contact / skills) + scrolling right
//   column (summary / experience / education / …). ATS-parseable DOM order:
//   sidebar first, then main content.
//
// Type scale — 4 steps only (no 11/12/13/14 noise band):
//   Display  clamp(36px, 3.2vw, 46px)  — name only
//   Body     13px                        — role headings, bullets, summary
//   Meta     11px                        — dates, contact, pills, context
//   Micro     9.5px uppercase tracked   — section labels, skill categories
//
// Print: @media print (cv-print.css) collapses grid to single column,
//   zeroes sidebar padding, restores contact separators — ATS-parseable.

'use client'

import Link from 'next/link'
import { cv } from './cv-data'
import type { CVVariant, CVRole, CVBullet, CVSkillGroup } from './types'
import './cv-print.css'

interface Props {
  variant: CVVariant
}

function visibleBullets(bullets: CVBullet[], variant: CVVariant) {
  return bullets.filter((b) => !b.variants || b.variants.includes(variant))
}

function sortedSkills(groups: CVSkillGroup[], variant: CVVariant) {
  return [...groups].sort((a, b) => (a.weight?.[variant] ?? 99) - (b.weight?.[variant] ?? 99))
}

// Micro-label used for section headers and skill category labels
function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`cv-section-title text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 pb-1.5 border-b border-gray-200 mb-3 mt-8 ${className}`}>
      {children}
    </h2>
  )
}

function SkillPill({ label }: { label: string }) {
  return (
    <span className="cv-pill inline-block border border-gray-300 rounded-full px-2 py-[2px] text-[11px] text-gray-700 bg-white leading-none">
      {label}
    </span>
  )
}

function RoleEntry({ role, variant }: { role: CVRole; variant: CVVariant }) {
  const bullets = visibleBullets(role.bullets, variant)
  if (bullets.length === 0) return null
  return (
    <article className="cv-role group pl-4 border-l-2 border-gray-100 hover:border-primary-600 transition-colors duration-300 mb-7 last:mb-0">
      <header className="mb-2.5">
        <h3 className="cv-role-heading text-[13px] font-semibold text-black leading-snug">
          {role.title}
          <span className="font-normal text-gray-500"> · {role.company}</span>
        </h3>
        <p className="cv-role-meta text-[11px] text-gray-500 mt-0.5">
          {role.dates}
          {role.location ? ` · ${role.location}` : ''}
        </p>
        {role.context && (
          <p className="cv-role-context text-[11px] text-gray-600 italic mt-1 leading-relaxed">
            {role.context}
          </p>
        )}
        {role.caseStudy && (
          <p className="mt-1.5">
            <Link
              href={role.caseStudy.href}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
            >
              ↗ {role.caseStudy.label}
            </Link>
          </p>
        )}
      </header>
      <ul className="cv-bullets space-y-1 text-[13px] text-gray-700 leading-relaxed">
        {bullets.map((b, j) => (
          <li key={j} className="flex gap-2.5">
            <span className="text-gray-300 mt-[3px] shrink-0 text-[9px]" aria-hidden>
              ▸
            </span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function CurriculumVitae({ variant }: Props) {
  const skills = sortedSkills(cv.skills, variant)
  const otherVariant: CVVariant = variant === 'de' ? 'ux' : 'de'

  return (
    <div className="cv-page min-h-screen bg-gray-50">
      <article className="cv-article mx-auto" style={{ maxWidth: '1100px' }}>

        {/* ── Controls — screen only ── */}
        <div className="cv-no-print px-8 pt-36 pb-5 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div
            role="tablist"
            aria-label="Resume variant"
            className="flex rounded-full border border-gray-200 bg-white p-1 shadow-sm"
          >
            <Link
              href="?variant=de"
              role="tab"
              aria-selected={variant === 'de'}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                variant === 'de' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Design Engineer
            </Link>
            <Link
              href="?variant=ux"
              role="tab"
              aria-selected={variant === 'ux'}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                variant === 'ux' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Product Designer
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] text-gray-400 leading-snug max-w-[200px] text-right">
              Print → "Save as PDF" strips styling for ATS.
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
            >
              ↓ Save as PDF
            </button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="cv-layout lg:grid lg:grid-cols-[280px_1fr]">

          {/* ── LEFT: identity + skills ─────────────────────── */}
          {/*
              DOM-first order means print (single-column) reads:
              name → headline → contact → skills → [main content]
              which is a valid ATS-parseable resume structure.
          */}
          <aside
            className="cv-sidebar lg:border-r lg:border-gray-100 px-8 pt-10 lg:pt-14 pb-10 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto animate-slide-up"
            style={{ animationFillMode: 'both' }}
          >
            {/* Name */}
            <h1
              className="cv-name text-black leading-[0.9] mb-2"
              style={{
                fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
                fontSize: 'clamp(40px, 4.5vw, 56px)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              {cv.name}
            </h1>

            {/* Headline */}
            <p className="cv-headline text-[13px] font-medium text-gray-700 leading-snug mb-5">
              {cv.headline[variant]}
            </p>

            {/* Rule */}
            <div className="h-px bg-gray-100 mb-5" />

            {/* Contact — flex-col on screen, flex-wrap on print (via cv-print.css).
                Separator spans are hidden on screen, revealed on print. */}
            <div className="cv-contact-row flex flex-col gap-[5px] text-[12px] text-gray-600">
              <span>{cv.contact.location}</span>
              {cv.contact.legalStatus && (
                <>
                  <span className="cv-sep hidden text-gray-300" aria-hidden>·</span>
                  <span>{cv.contact.legalStatus}</span>
                </>
              )}
              <span className="cv-sep hidden text-gray-300" aria-hidden>·</span>
              <a
                href={`mailto:${cv.contact.email}`}
                className="hover:text-black transition-colors"
              >
                {cv.contact.email}
              </a>
              {cv.contact.phone && (
                <>
                  <span className="cv-sep hidden text-gray-300" aria-hidden>·</span>
                  <span>{cv.contact.phone}</span>
                </>
              )}
              {cv.contact.links.map((l) => (
                <span key={l.href} className="contents">
                  <span className="cv-sep hidden text-gray-300" aria-hidden>·</span>
                  <a href={l.href} className="hover:text-black transition-colors">
                    {l.label}
                  </a>
                </span>
              ))}
            </div>

            {/* Skills */}
            <section aria-label="Skills">
              <SectionTitle>Skills</SectionTitle>
              <div className="cv-skills-groups flex flex-col gap-4">
                {skills.map((group) => (
                  <div key={group.label} className="cv-skills-group">
                    <span className="cv-skills-group-label block text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                      {group.label}
                    </span>
                    <ul className="cv-skills-group-items flex flex-wrap gap-1 list-none p-0">
                      {group.items.map((it, i) => (
                        <li key={i}>
                          <SkillPill label={it} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* ── RIGHT: summary + experience + education + … ─── */}
          <div
            className="cv-main-content px-10 pt-10 lg:pt-14 pb-24 animate-fade-in"
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          >
            {/* Summary */}
            <p className="cv-summary text-[15px] leading-[1.7] text-gray-800 max-w-[58ch]">
              {cv.summary[variant]}
            </p>

            {/* Experience */}
            <section>
              <SectionTitle>Experience</SectionTitle>
              <div className="flex flex-col">
                {cv.experience.map((role, i) => (
                  <RoleEntry key={i} role={role} variant={variant} />
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="flex flex-col gap-5">
                {cv.education.map((e, i) => (
                  <div key={i} className="cv-role pl-4 border-l-2 border-gray-100">
                    <h3 className="cv-role-heading text-[13px] font-semibold text-black">
                      {e.degree}
                      <span className="font-normal text-gray-500"> · {e.school}</span>
                    </h3>
                    <p className="cv-role-meta text-[11px] text-gray-500 mt-0.5">
                      {e.dates}
                      {e.location ? ` · ${e.location}` : ''}
                    </p>
                    {e.detail && (
                      <p className="text-[11px] text-gray-500 italic mt-1 leading-relaxed">
                        {e.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {cv.certifications && cv.certifications.length > 0 && (
              <section>
                <SectionTitle>Certifications</SectionTitle>
                <ul className="flex flex-col gap-1.5">
                  {cv.certifications.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                      <span className="text-gray-300 shrink-0 text-[9px] mt-[3px]" aria-hidden>▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Awards */}
            {cv.awards && cv.awards.length > 0 && (
              <section>
                <SectionTitle>Awards</SectionTitle>
                <ul className="flex flex-col gap-1.5">
                  {cv.awards.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                      <span className="text-gray-300 shrink-0 text-[9px] mt-[3px]" aria-hidden>▸</span>
                      <span>
                        {a.title}
                        {a.issuer && <span className="text-gray-500"> — {a.issuer}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Publications */}
            {cv.publications && cv.publications.length > 0 && (
              <section>
                <SectionTitle>Publications</SectionTitle>
                <ul className="flex flex-col gap-1.5">
                  {cv.publications.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                      <span className="text-gray-300 shrink-0 text-[9px] mt-[3px]" aria-hidden>▸</span>
                      <span>
                        {p.href ? (
                          <a href={p.href} className="underline underline-offset-2 hover:text-black">
                            {p.title}
                          </a>
                        ) : (
                          p.title
                        )}
                        {p.venue && <span className="text-gray-500"> — {p.venue}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            <section>
              <SectionTitle>Languages</SectionTitle>
              <p className="text-[13px] text-gray-700">{cv.languages.join(' · ')}</p>
            </section>

            {/* Outside work */}
            {cv.interests && cv.interests.length > 0 && (
              <section>
                <SectionTitle>Outside work</SectionTitle>
                <p className="text-[13px] text-gray-700">{cv.interests.join(' · ')}</p>
              </section>
            )}

            {/* References */}
            <section>
              <SectionTitle>References</SectionTitle>
              <p className="text-[13px] text-gray-700">Available on request.</p>
            </section>

            {/* Footer variant switcher — screen only */}
            <div className="cv-no-print mt-16 pt-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>
                Viewing{' '}
                <strong className="text-gray-600 font-medium">
                  {variant === 'de' ? 'Design Engineer' : 'Product Designer'}
                </strong>{' '}
                variant
              </span>
              <Link
                href={`?variant=${otherVariant}`}
                className="underline underline-offset-2 hover:text-gray-600 transition-colors"
              >
                Switch to {otherVariant === 'de' ? 'Design Engineer' : 'Product Designer'} →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
