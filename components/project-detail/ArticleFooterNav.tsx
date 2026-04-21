import Link from 'next/link'

interface NextProject {
  slug: string
  title: string
}

/**
 * Article footer: "← Back to all work" on the left, "Next Project" card on the right.
 * Always renders a next-project suggestion. When none is provided the caller should
 * pass a hardcoded fallback (e.g. the EF global navigation case study).
 */
export default function ArticleFooterNav({ next }: { next: NextProject }) {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 pt-16">
      <Link
        href="/#work"
        className="group text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors text-sm"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>{' '}
        Back to all work
      </Link>

      <Link
        href={`/work/${next.slug}`}
        className="group text-right block"
      >
        <span className="block text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px] font-medium mb-2">
          Next project
        </span>
        <span
          className="block text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors"
          style={{
            fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
            fontSize: 'clamp(22px, 2.4vw, 28px)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {next.title}{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </nav>
  )
}
