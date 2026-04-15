'use client'

/**
 * Editorial diagram: the three token layers.
 *
 * Primitives → Semantics → Components. Each column shows a representative
 * token and its role at that layer. Token names are rendered in the same
 * <code> style used inline throughout the article, so they feel native to
 * the prose.
 */

type Row = {
  name: string
  detail: string
}

type Column = {
  eyebrow: string
  title: string
  lede: string
  rows: Row[]
  footer?: { label: string; tone: 'rule' }
}

const COLUMNS: Column[] = [
  {
    eyebrow: '01 / Primitives',
    title: 'Raw values only',
    lede: 'Concrete, reusable values. No product meaning yet.',
    rows: [
      { name: 'primitive-color-orange-9', detail: '#E8520A' },
      { name: 'primitive-space-4', detail: '16px' },
      { name: 'primitive-radius-none', detail: '0px' },
    ],
  },
  {
    eyebrow: '02 / Semantics',
    title: 'Intent over value',
    lede: 'Roles map raw tokens into intent. Components consume this layer.',
    rows: [
      { name: 'color-action-primary', detail: '→ primitive-color-orange-9' },
      { name: 'layout-section-gap', detail: '→ primitive-space-8' },
      { name: 'radius-control', detail: '→ primitive-radius-none' },
    ],
  },
  {
    eyebrow: '03 / Components',
    title: 'Semantic-only UI',
    lede: 'Components consume semantic tokens only. Primitives never enter UI code directly.',
    rows: [
      { name: 'background', detail: 'var(--color-action-primary)' },
      { name: 'padding', detail: 'var(--space-control-md)' },
      { name: 'border-radius', detail: 'var(--radius-control)' },
    ],
    footer: {
      label: 'Rule: no var(--primitive-*) here.',
      tone: 'rule',
    },
  },
]

export default function TokenPipelineDiagram() {
  return (
    <figure className="my-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-0">
        {COLUMNS.map((col, i) => (
          <div key={col.eyebrow} className="relative">
            <div
              className={[
                'flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5',
                'md:rounded-none',
                i === 0 ? 'md:rounded-l-lg' : '',
                i === COLUMNS.length - 1 ? 'md:rounded-r-lg' : 'md:border-r-0',
              ].join(' ')}
            >
              <p
                className="mb-3 text-[11px] font-medium uppercase text-gray-500"
                style={{ letterSpacing: '0.12em' }}
              >
                {col.eyebrow}
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
                {col.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-600">
                {col.lede}
              </p>

              <div className="space-y-3">
                {col.rows.map((row) => (
                  <div key={row.name}>
                    <code className="inline-block rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12.5px] text-gray-800">
                      {row.name}
                    </code>
                    <p className="mt-1 font-mono text-[12.5px] text-gray-500">
                      {row.detail}
                    </p>
                  </div>
                ))}
              </div>

              {col.footer && (
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <p className="flex items-start gap-2 text-sm text-[#E8520A]">
                    <span aria-hidden="true" className="mt-0.5">
                      ⚠
                    </span>
                    <span>{col.footer.label}</span>
                  </p>
                </div>
              )}
            </div>

            {i < COLUMNS.length - 1 && (
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
    </figure>
  )
}
