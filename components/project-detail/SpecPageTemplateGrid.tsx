'use client'

/**
 * Editorial diagram: the six layout primitives that compose every Factory
 * spec page. Makes the invisible template visible — the article's
 * "structure of the docs is itself a machine-readable contract" claim.
 *
 * 2 × 3 grid on desktop; single column on mobile. Same light-theme card
 * style as <ContractFlowDiagram> and <TokenPipelineDiagram>.
 */

type Primitive = {
  n: string
  name: string
  role: string
  detail: string
}

const PRIMITIVES: Primitive[] = [
  {
    n: '01',
    name: 'SpecPageLayout',
    role: 'Page frame',
    detail:
      'Hero, anchored table of contents, section order. Every page renders the same scaffold.',
  },
  {
    n: '02',
    name: 'StateMatrix',
    role: 'State coverage',
    detail:
      'default · hover · active · focus · disabled for every variant. Missing cells fail the build.',
  },
  {
    n: '03',
    name: 'TokenMappingTable',
    role: 'Token resolution',
    detail:
      'Semantic → primitive chain for every token the component consumes. Generated, not written.',
  },
  {
    n: '04',
    name: 'UsageGuidance',
    role: 'When to use',
    detail:
      'Narrow rules for when to reach for the component — and the named alternatives when not.',
  },
  {
    n: '05',
    name: 'AccessibilityNotes',
    role: 'A11y contract',
    detail:
      'Roles, keyboard order, contrast minima, motion expectations. Enforced in jest-axe tests.',
  },
  {
    n: '06',
    name: 'DoDontExamples',
    role: 'Boundaries',
    detail:
      'Correct and incorrect compositions rendered side-by-side. Mistakes shown, not described.',
  },
]

export default function SpecPageTemplateGrid() {
  return (
    <figure className="my-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-0">
        {PRIMITIVES.map((p, i) => {
          const col = i % 3 // 0, 1, 2
          const row = Math.floor(i / 3) // 0 or 1
          return (
            <div
              key={p.name}
              className={[
                'h-full border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] p-5',
                // Round only the outer corners so the 2×3 grid reads as one block.
                'rounded-lg md:rounded-none',
                row === 0 && col === 0 ? 'md:rounded-tl-lg' : '',
                row === 0 && col === 2 ? 'md:rounded-tr-lg' : '',
                row === 1 && col === 0 ? 'md:rounded-bl-lg' : '',
                row === 1 && col === 2 ? 'md:rounded-br-lg' : '',
                // Kill seams between adjacent cards on desktop.
                col < 2 ? 'md:border-r-0' : '',
                row === 0 ? 'md:border-b-0' : '',
              ].join(' ')}
            >
              <div className="mb-3 flex items-baseline gap-2">
                <span
                  className="text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400"
                  style={{ letterSpacing: '0.12em' }}
                >
                  {p.n}
                </span>
                <span
                  className="text-[11px] font-medium uppercase text-gray-500 dark:text-gray-400"
                  style={{ letterSpacing: '0.12em' }}
                >
                  · {p.role}
                </span>
              </div>
              <code className="mb-2 inline-block rounded bg-gray-100 dark:bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-[12.5px] text-gray-900 dark:text-gray-200">
                {p.name}
              </code>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {p.detail}
              </p>
            </div>
          )
        })}
      </div>

      <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        The spec template. Every foundation and component page composes from
        these six primitives, in this order.
      </figcaption>
    </figure>
  )
}
