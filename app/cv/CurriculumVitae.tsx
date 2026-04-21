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
import { useEffect, useRef } from 'react'
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

// Lightweight scroll-reveal — IntersectionObserver, respects prefers-reduced-motion
// via global CSS rule that zeroes animation duration.
function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delayMs}ms`
            el.dataset.revealed = 'true'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delayMs])
  return ref
}

// Editorial section title — no border-b, softer tracking, warm muted gray.
// Relies on vertical rhythm for separation, not hairlines.
function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`cv-section-title text-[9.5px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-4 mt-12 ${className}`}>
      {children}
    </h2>
  )
}

function SkillPill({ label }: { label: string }) {
  return (
    <span
      className="cv-pill inline-block px-2 py-[3px] text-[11px] text-gray-800 dark:text-gray-200 bg-[#EFEEEA] dark:bg-[#1e1e1e] leading-none rounded-[4px]"
    >
      {label}
    </span>
  )
}

function RoleEntry({ role, variant, index }: { role: CVRole; variant: CVVariant; index: number }) {
  const bullets = visibleBullets(role.bullets, variant)
  const ref = useReveal<HTMLElement>(index * 60)
  if (bullets.length === 0) return null
  return (
    <article
      ref={ref}
      className="cv-role reveal mb-10 last:mb-0"
    >
      {/* 2-col grid on screen: dates in left gutter (editorial), content right.
          Collapses to single column on print via cv-print.css. */}
      <div className="cv-role-grid grid grid-cols-[110px_1fr] gap-x-6 max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
        <p className="cv-role-meta text-[11px] text-gray-600 dark:text-gray-400 font-mono pt-[3px] tabular-nums">
          {role.dates}
        </p>
        <div>
          <header className="mb-2.5">
            <h3 className="cv-role-heading text-[13px] font-semibold text-black dark:text-white leading-snug">
              {role.title}
              <span className="font-normal text-gray-600 dark:text-gray-400 italic"> — {role.company}</span>
            </h3>
            {role.location && (
              <p className="cv-role-location text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                {role.location}
              </p>
            )}
            {role.context && (
              <p className="cv-role-context text-[11px] text-gray-600 dark:text-gray-400 italic mt-1.5 leading-relaxed">
                {role.context}
              </p>
            )}
            {role.caseStudy && (
              <p className="mt-2">
                <Link
                  href={role.caseStudy.href}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-sm"
                >
                  <span aria-hidden>↗</span> {role.caseStudy.label}
                </Link>
              </p>
            )}
          </header>
          <ul className="cv-bullets space-y-1.5 text-[13px] text-gray-700 dark:text-gray-300 leading-[1.65]">
            {bullets.map((b, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="text-gray-400 mt-[6px] shrink-0 w-[3px] h-[3px] rounded-full bg-gray-400 dark:bg-gray-600" aria-hidden />
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default function CurriculumVitae({ variant }: Props) {
  const skills = sortedSkills(cv.skills, variant)
  const otherVariant: CVVariant = variant === 'de' ? 'ux' : 'de'

  return (
    <div className="cv-page min-h-screen">
      <article className="cv-article mx-auto" style={{ maxWidth: '1100px' }}>

        {/* ── Controls — screen only. Flat (no shadow), editorial. ── */}
        <div className="cv-no-print px-8 pt-36 pb-5 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <nav aria-label="Resume variant" className="flex rounded-full border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] p-1">
            <Link
              href="?variant=de"
              aria-current={variant === 'de' ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                variant === 'de'
                  ? 'bg-black dark:bg-white text-white dark:text-black cursor-default pointer-events-none'
                  : 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Design Engineer
            </Link>
            <Link
              href="?variant=ux"
              aria-current={variant === 'ux' ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                variant === 'ux'
                  ? 'bg-black dark:bg-white text-white dark:text-black cursor-default pointer-events-none'
                  : 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Product Designer
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-500">
              Save as PDF
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="Save resume as PDF"
            >
              <span aria-hidden>↓</span> Save as PDF
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
            aria-label="Contact and skills"
            className="cv-sidebar lg:border-r lg:border-gray-100 dark:lg:border-[#222] px-8 pt-10 lg:pt-14 pb-10 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto animate-slide-up"
            style={{ animationFillMode: 'both' }}
          >
            {/* Name */}
            <h1
              className="cv-name text-black dark:text-white leading-[0.92] mb-3"
              style={{
                fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
                fontSize: 'clamp(40px, 4.5vw, 56px)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                textWrap: 'balance',
              }}
            >
              {cv.name}
            </h1>

            {/* Headline */}
            <p
              className="cv-headline text-[13px] font-medium text-gray-700 dark:text-gray-300 leading-[1.4] mb-6"
              style={{ textWrap: 'balance' }}
            >
              {cv.headline[variant]}
            </p>

            {/* Rule */}
            <div className="h-px bg-gray-200 dark:bg-[#222] mb-5" />

            {/* Contact — flex-col on screen, flex-wrap on print (via cv-print.css).
                Separator spans are hidden on screen, revealed on print. */}
            <div className="cv-contact-row flex flex-col gap-[5px] text-[12px] text-gray-700 dark:text-gray-300">
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
                className="hover:text-black dark:hover:text-white transition-colors"
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
                  <a href={l.href} className="hover:text-black dark:hover:text-white transition-colors">
                    {l.label}
                  </a>
                </span>
              ))}
            </div>

            {/* Skills */}
            <section aria-label="Skills">
              <SectionTitle>Skills</SectionTitle>
              <div className="cv-skills-groups flex flex-col gap-5">
                {skills.map((group) => (
                  <div key={group.label} className="cv-skills-group">
                    <span className="cv-skills-group-label block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 mb-2">
                      {group.label}
                    </span>
                    <ul className="cv-skills-group-items flex flex-wrap gap-1.5 list-none p-0">
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
            {/* Summary — larger, editorial feel. Tighter measure for reading rhythm. */}
            <p
              className="cv-summary text-[17px] leading-[1.65] text-gray-800 dark:text-gray-200 mb-4 max-w-[52ch]"
              style={{ textWrap: 'pretty' }}
            >
              {cv.summary[variant]}
            </p>

            {/* Experience */}
            <section>
              <SectionTitle>Experience</SectionTitle>
              <div className="flex flex-col">
                {cv.experience.map((role, i) => (
                  <RoleEntry key={i} role={role} variant={variant} index={i} />
                ))}
              </div>
            </section>

            {/* Education — same dates-in-gutter grid pattern as Experience */}
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="flex flex-col gap-6">
                {cv.education.map((e, i) => (
                  <div key={i} className="cv-role">
                    <div className="cv-role-grid grid grid-cols-[110px_1fr] gap-x-6 max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
                      <p className="cv-role-meta text-[11px] text-gray-600 dark:text-gray-400 font-mono pt-[3px] tabular-nums">
                        {e.dates}
                      </p>
                      <div>
                        <h3 className="cv-role-heading text-[13px] font-semibold text-black dark:text-white leading-snug">
                          {e.degree}
                          <span className="font-normal text-gray-600 dark:text-gray-400 italic"> — {e.school}</span>
                        </h3>
                        {e.location && (
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{e.location}</p>
                        )}
                        {e.detail && (
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 italic mt-1 leading-relaxed">
                            {e.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {cv.certifications && cv.certifications.length > 0 && (
              <section>
                <SectionTitle>Certifications</SectionTitle>
                <ul className="flex flex-col gap-2">
                  {cv.certifications.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700 dark:text-gray-300 leading-[1.6]">
                      <span className="mt-[7px] shrink-0 w-[3px] h-[3px] rounded-full bg-gray-400 dark:bg-gray-600" aria-hidden />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Awards */}
            {cv.awards && cv.awards.length > 0 && (
              <section>
                <SectionTitle>Awards</SectionTitle>
                <ul className="flex flex-col gap-2">
                  {cv.awards.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700 dark:text-gray-300 leading-[1.6]">
                      <span className="mt-[7px] shrink-0 w-[3px] h-[3px] rounded-full bg-gray-400 dark:bg-gray-600" aria-hidden />
                      <span>
                        {a.title}
                        {a.issuer && <span className="text-gray-600 dark:text-gray-400 italic"> — {a.issuer}</span>}
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
                <ul className="flex flex-col gap-2">
                  {cv.publications.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-gray-700 dark:text-gray-300 leading-[1.6]">
                      <span className="mt-[7px] shrink-0 w-[3px] h-[3px] rounded-full bg-gray-400 dark:bg-gray-600" aria-hidden />
                      <span>
                        {p.href ? (
                          <a
                            href={p.href}
                            className="underline underline-offset-2 hover:text-black dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-sm"
                          >
                            {p.title}
                          </a>
                        ) : (
                          p.title
                        )}
                        {p.venue && <span className="text-gray-600 dark:text-gray-400 italic"> — {p.venue}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Other — key:value pairs for Languages / Outside work / References.
                Merged to avoid 3 heavy eyebrows for one-line facts. */}
            <section>
              <SectionTitle>Other</SectionTitle>
              <dl className="cv-other-grid grid grid-cols-[110px_1fr] gap-x-6 gap-y-2.5 text-[13px] max-[640px]:grid-cols-1 max-[640px]:gap-y-1">
                <dt className="text-[11px] text-gray-600 dark:text-gray-400 font-mono pt-[2px] uppercase tracking-wider">
                  Languages
                </dt>
                <dd className="text-gray-700 dark:text-gray-300 leading-[1.55]">{cv.languages.join(' · ')}</dd>

                {cv.interests && cv.interests.length > 0 && (
                  <>
                    <dt className="text-[11px] text-gray-600 dark:text-gray-400 font-mono pt-[2px] uppercase tracking-wider">
                      Outside work
                    </dt>
                    <dd className="text-gray-700 dark:text-gray-300 leading-[1.55]">{cv.interests.join(' · ')}</dd>
                  </>
                )}

                <dt className="text-[11px] text-gray-600 dark:text-gray-400 font-mono pt-[2px] uppercase tracking-wider">
                  References
                </dt>
                <dd className="text-gray-700 dark:text-gray-300 leading-[1.55]">Available on request.</dd>
              </dl>
            </section>

            {/* Footer variant switcher — screen only. Animated arrow on hover. */}
            <div className="cv-no-print mt-20 pt-6 border-t border-gray-200 dark:border-[#222] flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
              <span>
                Viewing{' '}
                <strong className="text-black dark:text-white font-medium">
                  {variant === 'de' ? 'Design Engineer' : 'Product Designer'}
                </strong>{' '}
                variant
              </span>
              <Link
                href={`?variant=${otherVariant}`}
                className="group inline-flex items-center gap-1 underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-sm"
              >
                Switch to {otherVariant === 'de' ? 'Design Engineer' : 'Product Designer'}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
