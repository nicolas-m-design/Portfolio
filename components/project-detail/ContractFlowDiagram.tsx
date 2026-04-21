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
                'h-full rounded-lg border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] p-5',
                // Remove the rounded seam between adjacent cards on desktop.
                'md:rounded-none',
                i === 0 ? 'md:rounded-l-lg' : '',
                i === STEPS.length - 1 ? 'md:rounded-r-lg' : 'md:border-r-0',
              ].join(' ')}
            >
              <p
                className="mb-3 text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400"
                style={{ letterSpacing: '0.12em' }}
              >
                {step.eyebrow}
              </p>
              <h3
                className="mb-2 text-gray-900 dark:text-white"
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
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {step.body.map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < step.body.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

          </div>
        ))}
      </div>

    </figure>
  )
}
