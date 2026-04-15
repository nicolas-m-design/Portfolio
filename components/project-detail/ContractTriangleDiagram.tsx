'use client'

/**
 * Editorial diagram: the three-artifact contract triangle.
 *
 * DESIGN.md sits at the apex; the Figma edit checklist and the token JSON
 * files sit at the base. Each edge names the obligation one artifact places
 * on the other two. Pure HTML + one inline SVG for the connecting lines, so
 * text stays at editorial sizes (14–16px) and scales with the reader.
 */

export default function ContractTriangleDiagram() {
  return (
    <figure className="my-4">
      <div className="relative mx-auto w-full max-w-[640px] px-2 py-4">
        {/* Connector lines (sit behind the cards) */}
        <svg
          viewBox="0 0 640 380"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          {/* left edge: apex → bottom-left */}
          <line
            x1="320" y1="70" x2="130" y2="310"
            stroke="#d1d5db" strokeWidth="1.5"
          />
          {/* right edge: apex → bottom-right */}
          <line
            x1="320" y1="70" x2="510" y2="310"
            stroke="#d1d5db" strokeWidth="1.5"
          />
          {/* base edge: bottom-left → bottom-right */}
          <line
            x1="130" y1="310" x2="510" y2="310"
            stroke="#d1d5db" strokeWidth="1.5"
          />
        </svg>

        {/* Nodes */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
          {/* Apex — DESIGN.md, centered above the two base nodes */}
          <div className="md:col-span-3 md:flex md:justify-center">
            <Node
              eyebrow="Contract"
              title="DESIGN.md"
              body="Visual rules, governance, route contract, test guardrails."
            />
          </div>

          {/* Bottom-left — Figma checklist */}
          <div className="md:col-start-1">
            <Node
              eyebrow="Design input"
              title="figma-edit-checklist.md"
              body="Declares tokens, component contract, responsive and a11y intent for every Figma edit."
            />
          </div>

          {/* Bottom-center: edge label on the base (desktop only) */}
          <EdgeLabel>Token inputs must match both.</EdgeLabel>

          {/* Bottom-right — token JSON */}
          <div className="md:col-start-3">
            <Node
              eyebrow="Token source"
              title="primitives.json · semantic.json"
              body="Raw values and role aliases. Generated CSS and docs derive from these."
            />
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-xs text-gray-500">
        Each artifact references the other two. Every AI agent has a stable
        reference point on any decision.
      </figcaption>
    </figure>
  )
}

function Node({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-[0_1px_0_rgba(17,24,39,0.03)]">
      <p
        className="mb-2 text-[11px] font-medium uppercase text-gray-500"
        style={{ letterSpacing: '0.12em' }}
      >
        {eyebrow}
      </p>
      <p
        className="mb-1 font-mono text-[13px] text-gray-900"
        style={{ wordBreak: 'break-word' }}
      >
        {title}
      </p>
      <p className="text-xs leading-relaxed text-gray-600">{body}</p>
    </div>
  )
}

function EdgeLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="hidden text-center text-xs italic text-gray-500 md:flex md:items-center md:justify-center"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      {children}
    </p>
  )
}
