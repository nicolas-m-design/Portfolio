'use client'

/**
 * Editorial diagram: the DESIGN.md contract flow.
 *
 * Four stages (Source → Execute → Output → Verify) rendered as a responsive
 * card row. All labels are real HTML text (not SVG) so they scale with the
 * reader's font-size settings and stay selectable.
 */

type Step = {
  eyebrow: string
  title: string
  body: string[]
}

const STEPS: Step[] = [
  {
    eyebrow: '01 / Source',
    title: 'Figma + MCP',
    body: ['Queryable variables,', 'components, and variants.'],
  },
  {
    eyebrow: '02 / Execute',
    title: 'AI Agents',
    body: ['Inspect, patch, and run', 'the checks that matter.'],
  },
  {
    eyebrow: '03 / Output',
    title: 'Tokens + UI',
    body: ['primitives.json,', 'semantic.json, React components.'],
  },
  {
    eyebrow: '04 / Verify',
    title: 'Spec App + Tests',
    body: ['Catches drift before shipping —', 'enforced, not narrated.'],
  },
]

export default function ContractFlowDiagram() {
  return (
    <figure className="my-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[repeat(4,1fr)] md:gap-0">
        {STEPS.map((step, i) => (
          <div key={step.eyebrow} className="relative">
            <div
              className={[
                'h-full rounded-lg border border-gray-200 bg-white p-5',
                // Remove the rounded seam between adjacent cards on desktop.
                'md:rounded-none',
                i === 0 ? 'md:rounded-l-lg' : '',
                i === STEPS.length - 1 ? 'md:rounded-r-lg' : 'md:border-r-0',
              ].join(' ')}
            >
              <p
                className="mb-3 text-[11px] font-medium uppercase text-gray-500"
                style={{ letterSpacing: '0.12em' }}
              >
                {step.eyebrow}
              </p>
              <h3
                className="mb-2 text-gray-900"
                style={{
                  fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
                  fontSize: '20px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  fontWeight: 500,
                }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {step.body.map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < step.body.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            {/* Arrow between cards (desktop only, not after last) */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 md:flex"
                style={{ width: 24, height: 24 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5h6M5.5 2.5 8 5l-2.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Source-of-truth strip */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-gray-200 pt-4">
        <p
          className="text-[11px] font-medium uppercase text-gray-500"
          style={{ letterSpacing: '0.12em' }}
        >
          Source of truth
        </p>
        <p className="text-sm text-gray-600">
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12.5px]">
            DESIGN.md
          </code>{' '}
          → one token chain, one place to catch drift.
        </p>
      </div>
    </figure>
  )
}
