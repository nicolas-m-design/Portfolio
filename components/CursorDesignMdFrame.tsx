'use client'

import React from 'react'

/**
 * Static replica of the Cursor IDE window displaying DESIGN.md.
 * Pure presentational — no interactivity.
 */
export default function CursorDesignMdFrame() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/40 bg-[#1e1e1e] font-mono text-[12px] leading-[1.5] text-[#cccccc] shadow-2xl select-none">
      {/* ── Title bar ─────────────────────────────────────────── */}
      <div className="flex h-[30px] items-center justify-between bg-[#2d2d2d] px-2 text-[11px] text-[#858585]">
        {/* left cluster */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[6px] pr-2">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </div>
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10.5 10.5 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </TitleIcon>
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TitleIcon>
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TitleIcon>
          <TitleIcon>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="4" cy="8" r="1" fill="currentColor" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
          </TitleIcon>
        </div>

        {/* center chip */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-[6px] rounded-[4px] bg-[#3c3c3c] px-2 py-[2px] text-[11px] text-[#cccccc]">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 5v6.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-8Z" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span>token-brand-system</span>
          </div>
        </div>

        {/* right cluster */}
        <div className="flex items-center gap-1">
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.1" />
              <path d="M8 3v10" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </TitleIcon>
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.1" />
              <path d="M2 9h12" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </TitleIcon>
          <TitleIcon>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.1" />
              <path d="M11 3v10" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </TitleIcon>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex h-[520px]">
        {/* Activity bar */}
        <div className="flex w-[44px] flex-col items-center gap-[14px] border-r border-black/40 bg-[#181818] py-3 text-[#858585]">
          <ActivityIcon>
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </ActivityIcon>
          <ActivityIcon active>
            <path d="M3 4h6l1.5 1.5H17V16H3V4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </ActivityIcon>
          <ActivityIcon>
            <circle cx="8" cy="9" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 12l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </ActivityIcon>
          <ActivityIcon>
            <path d="M4 6l6 4-6 4V6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M12 6v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </ActivityIcon>
          <ActivityIcon>
            <rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 8h14" stroke="currentColor" strokeWidth="1.4" />
          </ActivityIcon>
          <ActivityIcon>
            <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </ActivityIcon>
          <div className="mt-auto flex flex-col items-center gap-[14px]">
            <ActivityIcon>
              <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </ActivityIcon>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-[240px] flex-col border-r border-black/40 bg-[#252526]">
          <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#cccccc]">
            Explorer
          </div>

          <SectionHeader label="TOKEN-BRAND-SYSTEM" expanded />

          <div className="flex-1 overflow-hidden pb-2">
            <TreeRow depth={1} kind="folder" name=".claude" />
            <TreeRow depth={1} kind="folder" name=".github" />
            <TreeRow depth={1} kind="folder" name="dist" />
            <TreeRow depth={1} kind="folder" name="docs" />
            <TreeRow depth={1} kind="folder" name="node_modules" />
            <TreeRow depth={1} kind="folder" name="public" />
            <TreeRow depth={1} kind="folder" name="scripts" />
            <TreeRow depth={1} kind="folder" name="src" expanded />
            <TreeRow depth={2} kind="folder" name="components" badge="+" />
            <TreeRow depth={2} kind="folder" name="docs" />
            <TreeRow depth={2} kind="folder" name="generated" />
            <TreeRow depth={2} kind="folder" name="styles" />
            <TreeRow depth={2} kind="folder" name="test" />
            <TreeRow depth={2} kind="folder" name="tokens" expanded badge="+" />
            <TreeRow depth={3} kind="file" name="primitives.json" />
            <TreeRow depth={3} kind="file" name="semantic.json" />
            <TreeRow depth={1} kind="file" name=".gitignore" />
            <TreeRow depth={1} kind="file" name="App.css" badge="M" />
            <TreeRow depth={1} kind="file" name="App.tsx" badge="M" />
            <TreeRow depth={1} kind="file" name="main.ts" />
            <TreeRow depth={1} kind="file" name="site-env.d.ts" />
            <TreeRow depth={1} kind="file" name=".gitignore" />
            <TreeRow depth={1} kind="file" name="AGENTS.md" badge="U" />
            <TreeRow depth={1} kind="file" name="CONTRIBUTING.md" />
            <TreeRow depth={1} kind="file" name="DESIGN.md" selected />
            <TreeRow depth={1} kind="file" name="index.html" />
            <TreeRow depth={1} kind="file" name="LICENSE" />
            <TreeRow depth={1} kind="file" name="package-lock.json" />
            <TreeRow depth={1} kind="file" name="package.json" />
          </div>

          <SectionHeader label="OUTLINE" />
          <SectionHeader label="TIMELINE" />
          <SectionHeader label="LOCAL HISTORY" />
        </div>

        {/* Editor column */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
          {/* Tab strip */}
          <div className="flex h-[35px] items-stretch bg-[#2d2d2d] text-[12px]">
            <div className="flex items-center gap-2 border-r border-black/40 bg-[#1e1e1e] px-3 text-[#cccccc]">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h5l3 3v9H4V2Z" stroke="#519aba" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M9 2v3h3" stroke="#519aba" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              <span>DESIGN.md</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#858585]">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Markdown preview */}
          <div className="flex-1 overflow-auto px-10 py-6 font-sans text-[13.5px] leading-[1.65] text-[#d4d4d4]">
            <h1 className="mb-5 text-[28px] font-semibold text-white">Factory Design System</h1>

            <h2 className="mt-6 mb-3 text-[20px] font-semibold text-white">Summary</h2>
            <p className="mb-2 text-[#d4d4d4]">
              Factory Design System is a token-driven spec app built around one canonical visual language:
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-6 marker:text-[#858585]">
              <li>
                <span className="font-semibold text-white">Typeface:</span> Geist Mono
              </li>
              <li>
                <span className="font-semibold text-white">Brand palette:</span> orange + ink
              </li>
              <li>
                <span className="font-semibold text-white">Semantic blue:</span> informational-only
              </li>
            </ul>
            <p>
              The repo is intentionally structured so the token inputs are the single source of truth and the spec site is the visible expression of
              those tokens.
            </p>

            <h2 className="mt-7 mb-3 text-[20px] font-semibold text-white">Collaboration Source Of Truth</h2>
            <ul className="mb-3 list-disc space-y-1 pl-6 marker:text-[#858585]">
              <li>The repo is canonical for accepted design-system changes.</li>
              <li>
                Figma may diverge only in <InlineCode>WIP</InlineCode> exploration areas.
              </li>
              <li>
                Published Figma variables and components must match <InlineCode>main</InlineCode>.
              </li>
              <li>Canonical Figma changes require a matching repo PR.</li>
            </ul>

            <h2 className="mt-7 mb-3 text-[20px] font-semibold text-white">Source of Truth</h2>
            <p className="mb-2">Only these files define token values and aliases:</p>
            <ul className="mb-3 list-disc space-y-1 pl-6 marker:text-[#858585]">
              <li>
                <InlineCode>src/tokens/primitives.json</InlineCode>
              </li>
              <li>
                <InlineCode>src/tokens/semantic.json</InlineCode>
              </li>
            </ul>
            <p>All generated CSS variables and token docs derive from those files.</p>

            <h2 className="mt-7 mb-3 text-[20px] font-semibold text-white">Artifact Governance</h2>
            <p className="mb-2">The repo has more than one canonical layer. Each artifact has a different job:</p>
            <ul className="list-disc space-y-1 pl-6 marker:text-[#858585]">
              <li>Token values and alias relationships.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="h-[22px] border-t border-black/40 bg-[#181818]" />
    </div>
  )
}

/* ── Subcomponents ──────────────────────────────────────── */

function TitleIcon({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px] text-[#cccccc] hover:bg-[#3c3c3c]">
      {children}
    </button>
  )
}

function ActivityIcon({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={`relative flex h-[28px] w-[28px] items-center justify-center ${
        active ? 'text-[#ffffff]' : 'text-[#858585] hover:text-[#cccccc]'
      }`}
    >
      {active && <span className="absolute left-[-8px] top-0 h-full w-[2px] bg-[#ffffff]" />}
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        {children}
      </svg>
    </div>
  )
}

function SectionHeader({ label, expanded = false }: { label: string; expanded?: boolean }) {
  return (
    <div className="flex h-[22px] items-center gap-1 bg-[#2d2d2d] px-2 text-[11px] font-semibold uppercase tracking-wide text-[#cccccc]">
      <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>
        <path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </div>
  )
}

type TreeRowProps = {
  depth: number
  kind: 'folder' | 'file'
  name: string
  expanded?: boolean
  selected?: boolean
  badge?: 'M' | 'U' | '+'
}

function TreeRow({ depth, kind, name, expanded = false, selected = false, badge }: TreeRowProps) {
  const badgeColor =
    badge === 'M' ? 'text-[#e2c08d]' : badge === 'U' ? 'text-[#73c991]' : 'text-[#73c991]'

  const nameColor =
    badge === 'M' ? 'text-[#e2c08d]' : badge === 'U' ? 'text-[#73c991]' : selected ? 'text-white' : 'text-[#cccccc]'

  return (
    <div
      className={`flex h-[22px] items-center gap-1 pr-2 text-[12px] ${
        selected ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'
      }`}
      style={{ paddingLeft: 8 + depth * 12 }}
    >
      {kind === 'folder' ? (
        <>
          <svg width="10" height="10" viewBox="0 0 10 10" className={`text-[#858585] ${expanded ? 'rotate-90' : ''}`}>
            <path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M1.5 4A1 1 0 0 1 2.5 3h3l1.5 1.5h6a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-11A1 1 0 0 1 1.5 12V4Z"
              fill="#dcb67a"
            />
          </svg>
        </>
      ) : (
        <>
          <span className="inline-block w-[10px]" />
          {name.endsWith('.json') ? (
            <span className="w-[14px] text-center font-mono text-[11px] font-bold leading-none text-[#cbcb41]">
              {'{ }'}
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 2h5l3 3v9H4V2Z" stroke="#6b9fba" strokeWidth="1.1" strokeLinejoin="round" />
            </svg>
          )}
        </>
      )}
      <span className={`truncate ${nameColor}`}>{name}</span>
      {badge && <span className={`ml-auto text-[11px] font-semibold ${badgeColor}`}>{badge}</span>}
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[3px] bg-[#2d2d2d] px-[6px] py-[1px] font-mono text-[12.5px] text-[#e2c08d]">
      {children}
    </code>
  )
}
