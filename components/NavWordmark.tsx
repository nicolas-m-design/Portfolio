'use client'

import Link from 'next/link'

export default function NavWordmark() {
  return (
    <Link
      href="/"
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md"
      aria-label="Navigate to home page"
    >
      <span
        className="text-[#2F3437] dark:text-white"
        style={{
          fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
          fontSize: '1rem',
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        Nicolas Ménard
      </span>
    </Link>
  )
}
