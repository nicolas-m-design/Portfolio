'use client'

import { useEffect, useRef, useState } from 'react'

interface EmbeddedDemoTab {
  /** Label rendered in the tab bar. */
  label: string
  /** Path inside the embedded SPA, e.g. `/overview` or `/foundations/colors`. */
  path: string
}

interface EmbeddedDemoProps {
  /** Full URL or same-origin path to load inside the iframe (the SPA root). */
  src: string
  /** Short URL shown in the fake browser chrome's address bar. */
  displayUrl?: string
  /** Accessible title for the iframe. */
  title: string
  /** Aspect ratio as "w / h", default 16 / 10. */
  aspectRatio?: string
  /** Optional caption line shown below the frame. */
  caption?: string
  /**
   * Optional tab bar. Each tab deep-links into the SPA by setting the iframe's
   * hash (SPA uses HashRouter, so `#/overview` etc. is the canonical form).
   * When provided, the SPA's own sidebar is hidden via injected CSS.
   */
  tabs?: EmbeddedDemoTab[]
  /**
   * Internal viewport width the iframe renders at (in px). The iframe is then
   * scaled down via CSS transform to fit the available width. Default 1100,
   * which sits just above the SPA's 1024 responsive breakpoint so the full
   * desktop layout is shown without a horizontal scrollbar.
   */
  internalWidth?: number
  /**
   * CSS selectors inside the embedded SPA to hide. Only applied when `tabs`
   * is provided (tabs replace the SPA's own nav). Defaults match the Factory
   * spec app's sidebar.
   */
  hideSelectors?: string[]
}

/**
 * Drop-in live-demo embed for case-study pages.
 *
 * Renders a "browser chrome" container (mac traffic-light dots, URL pill,
 * "View Full Page" link) around an iframe of the given src. Optional tab bar
 * deep-links into routes of a HashRouter SPA. Theme-agnostic — reusable
 * across any project detail page.
 *
 * Note: the target URL must allow iframe embedding on this origin. The site-wide
 * `X-Frame-Options: DENY` header is explicitly relaxed to `SAMEORIGIN` for paths
 * that need to be embedded (see `next.config.js`).
 */
export default function EmbeddedDemo({
  src,
  displayUrl,
  title,
  aspectRatio = '16 / 10',
  caption,
  tabs,
  internalWidth = 1100,
  hideSelectors = ['.app__sidebar'],
}: EmbeddedDemoProps) {
  const shownUrl = displayUrl ?? src.replace(/^https?:\/\//, '')

  const [activeTab, setActiveTab] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const scaleWrapRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  // Compute scale so the iframe (rendered at internalWidth) fits the available
  // container width. Tracks container resizes.
  useEffect(() => {
    const el = scaleWrapRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setScale(w / internalWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [internalWidth])

  const activePath = tabs?.[activeTab]?.path
  const initialSrc = tabs && activePath ? `${src}#${activePath}` : src

  // When the active tab changes, update the iframe's hash in-place so the SPA's
  // HashRouter navigates without a full reload. Falls back to changing .src on
  // first render or if contentWindow isn't accessible.
  useEffect(() => {
    if (!tabs || !activePath) return
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const win = iframe.contentWindow
      if (win && win.location && win.location.hash !== `#${activePath}`) {
        win.location.hash = activePath
      }
    } catch {
      // cross-origin fallback — shouldn't hit this path for same-origin embeds
      iframe.src = `${src}#${activePath}`
    }
  }, [activeTab, activePath, src, tabs])

  // On iframe load, inject CSS to hide the SPA's own navigation so our tab bar
  // is the single source of truth. Same-origin required.
  const handleLoad = () => {
    if (!tabs || hideSelectors.length === 0) return
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument
      if (!doc) return
      const styleId = 'embedded-demo-hide-nav'
      if (doc.getElementById(styleId)) return
      const style = doc.createElement('style')
      style.id = styleId
      style.textContent = `
        ${hideSelectors.join(', ')} { display: none !important; }
        .app { grid-template-columns: 1fr !important; display: flex !important; justify-content: center !important; }
        .app__main { width: 100% !important; max-width: 880px !important; margin: 0 auto !important; }
      `
      doc.head.appendChild(style)
    } catch {
      // ignore (cross-origin)
    }
  }

  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] shadow-sm dark:shadow-none">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#1a1a1a] px-3 py-2.5">
          {/* Traffic-light dots */}
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="block h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="block h-3 w-3 rounded-full bg-[#28C840]" />
          </div>

          {/* URL pill */}
          <div className="flex-1 min-w-0">
            <div className="truncate rounded-md border border-gray-200 dark:border-[#333] bg-white dark:bg-[#111] px-3 py-1 text-center text-xs text-gray-600 dark:text-gray-400">
              {shownUrl}
              {tabs && activePath ? (
                <span className="text-gray-400">#{activePath}</span>
              ) : null}
            </div>
          </div>

          {/* View full page */}
          <a
            href={tabs && activePath ? `${src}#${activePath}` : src}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md border border-gray-200 dark:border-[#333] bg-white dark:bg-[#111] px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:text-gray-900 hover:border-gray-300 dark:hover:text-gray-100 dark:hover:border-[#444]"
          >
            View Full Page <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Tab bar */}
        {tabs && tabs.length > 0 && (
          <div
            role="tablist"
            aria-label={`${title} sections`}
            className="flex items-center gap-1 border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] px-3 pt-2"
          >
            {tabs.map((tab, i) => {
              const isActive = i === activeTab
              return (
                <button
                  key={tab.path}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(i)}
                  className={[
                    'shrink-0 rounded-t-md px-3 py-2 text-xs font-medium transition-colors',
                    'border border-b-0',
                    isActive
                      ? 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 -mb-px'
                      : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Iframe (rendered at internalWidth, scaled to fit) */}
        <div
          ref={scaleWrapRef}
          className="relative w-full overflow-hidden bg-white dark:bg-[#111]"
          style={{ aspectRatio }}
        >
          <iframe
            ref={iframeRef}
            src={initialSrc}
            title={title}
            loading="lazy"
            onLoad={handleLoad}
            className="absolute top-0 left-0 border-0"
            style={{
              width: `${internalWidth}px`,
              height: `${100 / scale}%`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
