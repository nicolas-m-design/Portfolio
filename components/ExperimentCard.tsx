'use client'

import Link from 'next/link'
import { useSquircle } from '@/hooks/useSquircle'

export interface Experiment {
  slug: string
  title: string
  description: string
  thumbnail?: string
  /** Solid background color. When set, overrides thumbnail/image rendering. */
  bgColor?: string
  tags: string[]
  newTab?: boolean
}

interface ExperimentCardProps {
  experiment: Experiment
}

export default function ExperimentCard({ experiment }: ExperimentCardProps) {
  const { slug, title, description, thumbnail, bgColor, tags, newTab } = experiment
  const squircleRef = useSquircle<HTMLElement>({ cornerRadius: 28, cornerSmoothing: 0.8 })

  const isVideo = thumbnail && thumbnail.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)

  const backgroundImage = thumbnail
    ? thumbnail
    : `https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&auto=format,compress&q=80`

  const href = `/experiments/${slug}`
  const commonProps = {
    className:
      'block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 rounded-2xl transition-colors duration-200 squircle-shadow',
    'aria-label': `View experiment: ${title}`,
    tabIndex: 0,
  }

  const articleEl = (
    <article
      ref={squircleRef}
      className="relative h-[320px] rounded-2xl overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
      role="article"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
        {/* Video / image / solid color background */}
        {!bgColor && isVideo ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-label={`Background video for ${title} experiment`}
            >
              <source src={thumbnail} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br" aria-hidden="true"></div>
          </>
        ) : !bgColor ? (
          <img
            src={backgroundImage}
            alt={`${title} experiment preview`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.7)',
            }}
          />
        ) : null}

        {/* Gradient overlay — skip when using solid bg */}
        {!bgColor && <div className="absolute inset-0 bg-gradient-to-br" aria-hidden="true"></div>}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" aria-hidden="true"></div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-8 text-white z-20">
          <div className="w-full max-w-md">
            {/* Type badges */}
            {tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-medium mb-3 text-white leading-tight">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-base text-white mb-4 leading-6">
                {description}
              </p>
            )}
          </div>
        </div>
      </article>
  )

  return newTab ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
      {articleEl}
    </a>
  ) : (
    <Link href={href} {...commonProps}>
      {articleEl}
    </Link>
  )
}
