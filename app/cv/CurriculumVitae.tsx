// app/cv/CurriculumVitae.tsx
//
// Renders the CV for on-screen viewing and ATS-safe print output.
// Design direction: Swiss editorial — typographically confident, structured,
// minimal but with craft. Matches the portfolio's PP Neue Montreal brand.
//
// On-screen: warm white bg, large name, skill pills, left-border role accents,
//            staggered load animation, variant toggle + PDF button.
// On print:  all visual decoration stripped by cv-print.css → clean
//            single-column parseable text for ATS/LLM screeners.

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-title text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-5 mt-14 pb-2 border-b border-gray-100">
      {children}
    </h2>
  )
}

function SkillPill({ label }: { label: string }) {
  return (
    <span className="cv-pill inline-block border border-gray-200 rounded-full px-2.5 py-[3px] text-[11px] text-gray-700 bg-white leading-none">
      {label}
    </span>
  )
}

function RoleEntry({ role, variant }: { role: CVRole; variant: CVVariant }) {
  const bullets = visibleBullets(role.bullets, variant)
  if (bullets.length === 0) return null
  return (
    <article className="cv-role group pl-4 border-l-2 border-gray-100 hover:border-primary-600 transition-colors duration-300">
      <header className="mb-3">
        <h3 className="cv-role-heading text-sm font-semibold text-black leading-snug">
          {role.title}
          <span className="font-normal text-gray-500"> · {role.company}</span>
        </h3>
        <p className="cv-role-meta text-xs text-gray-400 mt-0.5 tracking-wide">
          {role.dates}
          {role.location ? ` · ${role.location}` : ''}
        </p>
        {role.context && (
          <p className="cv-role-context text-[11px] text-gray-500 italic mt-1 max-w-[55ch] leading-relaxed">
            {role.context}
          </p>
        )}
        {role.caseStudy && (
          <p className="mt-2">
            <Link
              href={role.caseStudy.href}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
            >
              ↗ {role.caseStudy.label}
            </Link>
          </p>
        )}
      </header>
      <ul className="cv-bullets space-y-1.5 text-[13px] text-gray-700 leading-relaxed">
        {bullets.map((b, j) => (
          <li key={j} className="flex gap-2.5">
            <span className="text-gray-300 mt-[3px] shrink-0 text-[10px]" aria-hidden>
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
      <article className="cv-article article-column pt-28 pb-28 px-6">

        {/* ── Controls — in-flow, hidden on print ── */}
        <div className="cv-no-print mb-10 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
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
                variant === 'de'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Design Engineer
            </Link>
            <Link
              href="?variant=ux"
              role="tab"
              aria-selected={variant === 'ux'}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                variant === 'ux'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
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

        {/* ── Header ── */}
        <header className="mb-12">
          {/* Name */}
          <div
            className="animate-slide-up"
            style={{ animationFillMode: 'both' }}
          >
            <h1 className="cv-name font-semibold text-black leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(52px, 9vw, 82px)' }}>
              {cv.name}
            </h1>
          </div>

          {/* Rule */}
          <div
            className="h-px bg-gray-200 mt-5 mb-5 animate-fade-in"
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          />

          {/* Headline */}
          <p
            className="cv-headline text-sm font-medium text-gray-800 mb-4 animate-fade-in"
            style={{ animationDelay: '120ms', animationFillMode: 'both' }}
          >
            {cv.headline[variant]}
          </p>

          {/* Contact row */}
          <div
            className="cv-contact-row flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-500 mb-6 animate-fade-in"
            style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          >
            <span>{cv.contact.location}</span>
            {cv.contact.legalStatus && (
              <>
                <span className="text-gray-300 select-none" aria-hidden>·</span>
                <span>{cv.contact.legalStatus}</span>
              </>
            )}
            <span className="text-gray-300 select-none" aria-hidden>·</span>
            <a href={`mailto:${cv.contact.email}`} className="hover:text-black transition-colors">
              {cv.contact.email}
            </a>
            {cv.contact.phone && (
              <>
                <span className="text-gray-300 select-none" aria-hidden>·</span>
                <span>{cv.contact.phone}</span>
              </>
            )}
            {cv.contact.links.map((l, i) => (
              <span key={l.href} className="contents">
                <span className="text-gray-300 select-none" aria-hidden>·</span>
                <a
                  href={l.href}
                  className="hover:text-black transition-colors"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>

          {/* Summary */}
          <p
            className="cv-summary text-sm leading-[1.75] text-gray-700 max-w-[62ch] animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            {cv.summary[variant]}
          </p>
        </header>

        {/* ── Skills ── */}
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="cv-skills-groups flex flex-col gap-4">
            {skills.map((group) => (
              <div key={group.label} className="cv-skills-group">
                <span className="cv-skills-group-label block text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                  {group.label}
                </span>
                <ul className="cv-skills-group-items flex flex-wrap gap-1.5 p-0 list-none">
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

        {/* ── Experience ── */}
        <section>
          <SectionTitle>Experience</SectionTitle>
          <div className="flex flex-col gap-8">
            {cv.experience.map((role, i) => (
              <RoleEntry key={i} role={role} variant={variant} />
            ))}
          </div>
        </section>

        {/* ── Education ── */}
        <section>
          <SectionTitle>Education</SectionTitle>
          <div className="flex flex-col gap-5">
            {cv.education.map((e, i) => (
              <div key={i} className="cv-role pl-4 border-l-2 border-gray-100">
                <h3 className="cv-role-heading text-sm font-semibold text-black">
                  {e.degree}
                  <span className="font-normal text-gray-500"> · {e.school}</span>
                </h3>
                <p className="cv-role-meta text-xs text-gray-400 mt-0.5">
                  {e.dates}
                  {e.location ? ` · ${e.location}` : ''}
                </p>
                {e.detail && (
                  <p className="text-[11px] text-gray-500 italic mt-1 max-w-[55ch] leading-relaxed">
                    {e.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Certifications ── */}
        {cv.certifications && cv.certifications.length > 0 && (
          <section>
            <SectionTitle>Certifications</SectionTitle>
            <ul className="flex flex-col gap-1.5">
              {cv.certifications.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                  <span className="text-gray-300 shrink-0 text-[10px] mt-[3px]" aria-hidden>▸</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Awards ── */}
        {cv.awards && cv.awards.length > 0 && (
          <section>
            <SectionTitle>Awards</SectionTitle>
            <ul className="flex flex-col gap-1.5">
              {cv.awards.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                  <span className="text-gray-300 shrink-0 text-[10px] mt-[3px]" aria-hidden>▸</span>
                  <span>
                    {a.title}
                    {a.issuer && <span className="text-gray-500"> — {a.issuer}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Publications ── */}
        {cv.publications && cv.publications.length > 0 && (
          <section>
            <SectionTitle>Publications</SectionTitle>
            <ul className="flex flex-col gap-1.5">
              {cv.publications.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] text-gray-700">
                  <span className="text-gray-300 shrink-0 text-[10px] mt-[3px]" aria-hidden>▸</span>
                  <span>
                    {p.href ? (
                      <a href={p.href} className="underline underline-offset-2 hover:text-black">
                        {p.title}
                      </a>
                    ) : p.title}
                    {p.venue && <span className="text-gray-500"> — {p.venue}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Languages + Interests ── */}
        <section>
          <SectionTitle>Languages</SectionTitle>
          <p className="text-[13px] text-gray-700">{cv.languages.join(' · ')}</p>
        </section>

        {cv.interests && cv.interests.length > 0 && (
          <section>
            <SectionTitle>Outside work</SectionTitle>
            <p className="text-[13px] text-gray-700">{cv.interests.join(' · ')}</p>
          </section>
        )}

        {/* ── References ── */}
        <section>
          <SectionTitle>References</SectionTitle>
          <p className="text-[13px] text-gray-700">Available on request.</p>
        </section>

        {/* Variant switcher footer (screen only) */}
        <div className="cv-no-print mt-20 pt-8 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
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
      </article>
    </div>
  )
}
