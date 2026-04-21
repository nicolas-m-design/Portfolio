import React from 'react'

export interface MetaRow {
  label: string
  /** Plain text values — rendered with `·` separators */
  values?: string[]
  /** Or provide fully custom right-column content (e.g. links) */
  content?: React.ReactNode
}

/**
 * Typographic metadata block ("colophon" style).
 * Two-column grid: small uppercase label on the left, plain-text values on the right.
 * Replaces the earlier gray pill-chip treatment.
 */
export default function ArticleMeta({ rows }: { rows: MetaRow[] }) {
  if (rows.length === 0) return null
  return (
    <dl className="grid grid-cols-[7rem_1fr] gap-x-6 gap-y-3 text-sm">
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <dt className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px] font-medium pt-0.5">
            {row.label}
          </dt>
          <dd className="text-gray-900 dark:text-white">
            {row.content ? row.content : (row.values || []).join(' · ')}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
