import Link from 'next/link'

export interface Experiment {
  slug: string
  title: string
  description: string
  thumbnail?: string
  tags: string[]
}

interface ExperimentCardProps {
  experiment: Experiment
}

export default function ExperimentCard({ experiment }: ExperimentCardProps) {
  const { slug, title, description, thumbnail, tags } = experiment

  const isVideo = thumbnail && thumbnail.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)

  const backgroundImage = thumbnail
    ? thumbnail
    : `https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&auto=format,compress&q=80`

  return (
    <Link
      href={`/experiments/${slug}`}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 rounded-2xl transition-all duration-200"
      aria-label={`View experiment: ${title}`}
      tabIndex={0}
    >
      <article className="relative h-[320px] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2" role="article">
        {/* Video background or image fallback */}
        {isVideo ? (
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
        ) : (
          <img
            src={backgroundImage}
            alt={`${title} experiment preview`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.7)',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br" aria-hidden="true"></div>

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
    </Link>
  )
}
