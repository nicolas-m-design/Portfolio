'use client'

/**
 * Editorial visual: a stylized agent session log for the Button Loading state
 * reconciliation described in the Solution section. Dark, monospace — pairs
 * visually with <CursorDesignMdFrame> so the article reads as
 * "here's the contract → here's the agent acting on it."
 *
 * All text is real HTML, not SVG, so it scales and stays selectable.
 */

type Step = {
  t: string
  label: string
  detail?: string
}

const STEPS: Step[] = [
  {
    t: '00:00',
    label: 'Pull variant metadata from Figma',
    detail: '183:182 · Size=Large · Variant=Primary · State=Loading',
  },
  {
    t: '00:43',
    label: 'Detect missing icon in curated dictionary',
    detail: 'remix-icons/line/system/loader-4-line',
  },
  {
    t: '02:10',
    label: 'Read SVG from node_modules/remixicon',
    detail: 'add path data to Icon.tsx curated dictionary',
  },
  {
    t: '04:32',
    label: 'Swap spinner <div> for <Icon /> in Button.tsx',
    detail: 'reference semantic --color-action-primary (not primitive)',
  },
  {
    t: '06:55',
    label: 'Run typecheck · build · test suites',
    detail: 'all green',
  },
]

export default function AgentTraceCard() {
  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-lg border border-black/40 bg-[#1e1e1e] font-mono text-[12.5px] leading-[1.55] text-[#cccccc] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-black/40 bg-[#2d2d2d] px-3 py-2 text-[11px] text-[#858585]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-[6px]" aria-hidden="true">
              <span className="block h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
              <span className="block h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
              <span className="block h-[10px] w-[10px] rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2 text-[#cccccc]">
              claude-code · reconcile Button Loading state
            </span>
          </div>
          <span className="text-[#858585]">7 min · solo</span>
        </div>

        {/* Steps */}
        <ol className="divide-y divide-white/5 px-4 py-3">
          {STEPS.map((step, i) => {
            const isFinal = i === STEPS.length - 1
            return (
              <li
                key={step.t}
                className="grid grid-cols-[56px_16px_1fr] items-start gap-x-3 py-2.5"
              >
                {/* timestamp */}
                <span className="pt-[1px] text-[#6b7280]">{step.t}</span>
                {/* marker */}
                <span
                  aria-hidden="true"
                  className={
                    isFinal
                      ? 'pt-[1px] text-[#73c991]'
                      : 'pt-[1px] text-[#cbcb41]'
                  }
                >
                  {isFinal ? '✓' : '→'}
                </span>
                {/* body */}
                <div>
                  <p
                    className={
                      isFinal
                        ? 'font-sans text-[13.5px] text-[#73c991]'
                        : 'font-sans text-[13.5px] text-white'
                    }
                  >
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="mt-0.5 text-[#9ca3af]">{step.detail}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {/* Bottom summary strip */}
        <div className="flex items-center justify-between border-t border-black/40 bg-[#181818] px-4 py-2 text-[11px] text-[#858585]">
          <span>
            Bound only to rules in{' '}
            <span className="text-[#e2c08d]">DESIGN.md</span> + token files
          </span>
          <span className="text-[#73c991]">● typecheck · build · tests green</span>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Agent session: Button Loading state reconciled from Figma to code. The
        agent never invented anything — every move is bound to an explicit
        rule.
      </figcaption>
    </figure>
  )
}
