'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react'
import { Project } from '@/types'
import Lightbox from './Lightbox'
import { getProjects } from '@/lib/cosmic'
import ArticleMeta, { MetaRow } from './project-detail/ArticleMeta'
import ArticleFooterNav from './project-detail/ArticleFooterNav'

interface ProjectDetailProps {
  project: Project
}

// When the current project has no natural "next", link here as a fallback.
const NEXT_PROJECT_FALLBACK = {
  slug: 'redesigning-ef-global-navigation',
  title: 'Redesigning EF Global Navigation',
}

function getProjectTypeLabel(
  projectType: { key: string; value: string } | string[] | undefined
): string {
  if (!projectType) return 'Case Study'
  if (Array.isArray(projectType)) return projectType[0] || 'Case Study'
  if (typeof projectType === 'object' && 'value' in projectType) return projectType.value
  return 'Case Study'
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { metadata } = project
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [nextProject, setNextProject] = useState<{ slug: string; title: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects()
        const currentIndex = projectsData.findIndex((p) => p.id === project.id)
        if (currentIndex !== -1 && projectsData.length > 1) {
          const nextIndex = (currentIndex + 1) % projectsData.length
          const n = projectsData[nextIndex]
          setNextProject({ slug: n.slug, title: n.metadata?.project_name || n.title })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [project.id])

  const openLightbox = (images: string[], index: number) => {
    setGalleryImages(images)
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  const previousImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    )

  const renderImage = (src: string, alt: string, group: string[], index: number) => (
    <button
      onClick={() => openLightbox(group, index)}
      className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg block"
      aria-label={`${alt} (opens in lightbox)`}
    >
      <div className="w-full overflow-hidden" style={{ maxHeight: '538px', borderRadius: '0.5rem' }}>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={800}
          className="w-full object-cover cursor-pointer"
          style={{ borderRadius: '0.5rem' }}
          unoptimized
        />
      </div>
    </button>
  )

  // Collect typographic metadata rows
  const metaRows: MetaRow[] = []
  const company = metadata?.company || metadata?.client_company
  if (company) metaRows.push({ label: 'Company', values: [company] })
  if (metadata?.project_duration) metaRows.push({ label: 'Duration', values: [metadata.project_duration] })
  if (metadata?.tools_used && metadata.tools_used.length > 0) {
    metaRows.push({ label: 'Tools', values: metadata.tools_used })
  }

  const linkItems: React.ReactNode[] = []
  const externalLink = (href: string, label: string, key: string) => (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:text-primary-700 underline underline-offset-2"
    >
      {label}
    </a>
  )
  if (metadata?.live_url) linkItems.push(externalLink(metadata.live_url, metadata.live_url_text || 'Live Project', 'live'))
  if (metadata?.live_url_2) linkItems.push(externalLink(metadata.live_url_2, metadata.live_url_2_text || 'Live Project 2', 'live2'))
  if (metadata?.case_study_url) linkItems.push(externalLink(metadata.case_study_url, 'Case Study', 'cs'))
  if (linkItems.length > 0) {
    metaRows.push({
      label: 'Links',
      content: <span className="flex flex-wrap gap-x-4 gap-y-1">{linkItems}</span>,
    })
  }

  // Build article sections
  const sections: React.ReactNode[] = []

  const sectionOrder: Array<{
    key: string
    prose?: string
    images: Array<string | undefined>
    labelPrefix: string
  }> = [
    {
      key: 'overview',
      prose: metadata?.project_overview,
      images: [metadata?.project_overview_image, metadata?.project_overview_image_2],
      labelPrefix: 'Overview',
    },
    {
      key: 'challenge',
      prose: metadata?.challenge_and_research,
      images: [
        metadata?.challenge_and_research_image,
        metadata?.challenge_and_research_image_2,
        metadata?.challenge_and_research_image_3,
      ],
      labelPrefix: 'Challenge & Research',
    },
    {
      key: 'process',
      prose: metadata?.design_process,
      images: [
        metadata?.design_process_image,
        metadata?.design_process_image_2,
        metadata?.design_process_image_3,
      ],
      labelPrefix: 'Design Process',
    },
    {
      key: 'solution',
      prose: metadata?.solution,
      images: [metadata?.solution_image, metadata?.solution_image_2, metadata?.solution_image_3],
      labelPrefix: 'Solution',
    },
    {
      key: 'implementation',
      prose: metadata?.implementation_and_results,
      images: [
        metadata?.implementation_and_results_image,
        metadata?.implementation_and_results_image_2,
      ],
      labelPrefix: 'Implementation & Results',
    },
    {
      key: 'reflection',
      prose: metadata?.reflection,
      images: [metadata?.reflection_image, metadata?.reflection_image_2],
      labelPrefix: 'Reflection',
    },
  ]

  sectionOrder.forEach((s) => {
    const imgs = s.images.filter((img): img is string => Boolean(img))
    if (!s.prose && imgs.length === 0) return
    sections.push(
      <section key={s.key}>
        {imgs.length > 0 && (
          <div className="mb-10 space-y-4">
            {imgs.map((src, i) => (
              <div key={i}>
                {renderImage(src, `${s.labelPrefix} image ${i + 1} for ${metadata?.project_name || project.title}`, imgs, i)}
              </div>
            ))}
          </div>
        )}
        {s.prose && (
          <div className="article-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {s.prose}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  })

  // Fallbacks
  if (sections.length === 0 && metadata?.description) {
    sections.push(
      <section key="description">
        <div className="article-prose" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: metadata.description }} />
      </section>
    )
  }
  if (sections.length === 0) {
    if (metadata?.challenge) {
      sections.push(
        <section key="challenge-old">
          <div className="article-prose">
            <p>{metadata.challenge}</p>
          </div>
        </section>
      )
    }
    if (metadata?.solution) {
      const solutionImages = [metadata?.solution_image].filter((img): img is string => Boolean(img))
      sections.push(
        <section key="solution-old">
          {solutionImages.length > 0 && (
            <div className="mb-10">
              {solutionImages.map((src, i) => (
                <div key={i}>
                  {renderImage(src, `Solution image for ${metadata?.project_name || project.title}`, solutionImages, i)}
                </div>
              ))}
            </div>
          )}
          <div className="article-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.solution}
            </ReactMarkdown>
          </div>
        </section>
      )
    }
  }

  // Project gallery (individual images)
  const individualImages: string[] = []
  for (let i = 1; i <= 20; i++) {
    const imageKey = `image_${i}` as keyof typeof metadata
    const imageUrl = metadata?.[imageKey] as string | undefined
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      individualImages.push(imageUrl)
    }
  }
  const contentSectionImages: string[] = []
  if (metadata) {
    const keys = [
      'hero_image',
      'cloudinary_hero_image',
      'project_overview_image',
      'project_overview_image_2',
      'challenge_and_research_image',
      'challenge_and_research_image_2',
      'challenge_and_research_image_3',
      'design_process_image',
      'design_process_image_2',
      'design_process_image_3',
      'solution_image',
      'solution_image_2',
      'solution_image_3',
      'implementation_and_results_image',
      'implementation_and_results_image_2',
      'reflection_image',
      'reflection_image_2',
    ] as const
    keys.forEach((k) => {
      const v = metadata[k] as string | undefined
      if (v) contentSectionImages.push(v)
    })
  }
  const filteredIndividualImages = individualImages.filter((u) => !contentSectionImages.includes(u))
  const galleryImgs = Array.from(new Set(filteredIndividualImages))
  const hasCloudinaryGallery = metadata?.cloudinary_gallery_images && JSON.parse(metadata.cloudinary_gallery_images).length > 0
  const hasOriginalGallery = metadata?.project_gallery && metadata.project_gallery.length > 0
  const hasGallery = galleryImgs.length > 0 || hasCloudinaryGallery || hasOriginalGallery

  // Decide which next project to surface
  const currentSlug = project.slug
  const fallbackIsSelf = NEXT_PROJECT_FALLBACK.slug === currentSlug
  const resolvedNext = nextProject || (fallbackIsSelf ? null : NEXT_PROJECT_FALLBACK)

  return (
    <article className="pt-36 pb-16">
      {/* Hero text */}
      <div className="container article-column">
        <div>
          <p
            className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase mb-6"
            style={{ fontSize: '12px', letterSpacing: '0.12em' }}
          >
            {getProjectTypeLabel(metadata?.project_type)}
          </p>

          <h1
            className="text-gray-900 dark:text-white mb-8"
            style={{
              fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
              fontSize: 'clamp(40px, 6vw, 56px)',
              lineHeight: 1.07,
              letterSpacing: '-0.02em',
              fontWeight: 500,
              marginTop: 0,
            }}
          >
            {metadata?.project_name || project.title}
          </h1>

          {metadata?.description_short && (
            <div
              className="text-gray-700 dark:text-gray-300 mb-12"
              style={{
                fontFamily: "'PP Neue Montreal', ui-sans-serif, system-ui, sans-serif",
                fontSize: 'clamp(18px, 1.6vw, 20px)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{ __html: metadata.description_short }}
            />
          )}
        </div>

        {metaRows.length > 0 && <ArticleMeta rows={metaRows} />}
      </div>

      {/* Content sections */}
      <div className="container article-column" style={{ marginTop: '96px' }}>
        <div className="space-y-24">{sections}</div>

        {/* Project gallery */}
        {hasGallery && (
          <div style={{ marginTop: '96px' }}>
            <div className="space-y-24" role="list" aria-label="Project gallery images">
              {galleryImgs.length > 0
                ? galleryImgs.map((imageUrl: string, index: number) => {
                    const isVideo = imageUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)
                    return (
                      <div key={index} role="listitem">
                        {isVideo ? (
                          <div className="w-full">
                            <video
                              src={imageUrl}
                              className="w-full h-auto object-cover rounded-lg"
                              style={{ maxHeight: '538px' }}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              aria-label={`${metadata?.project_name || project.title} project video ${index + 1}`}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              openLightbox(
                                galleryImgs.filter((url) => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)),
                                galleryImgs
                                  .filter((url) => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/))
                                  .indexOf(imageUrl)
                              )
                            }
                            className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg overflow-hidden"
                            style={{ maxHeight: '538px' }}
                            aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                              width={1600}
                              height={900}
                              className="w-full h-auto object-cover rounded-lg cursor-pointer"
                              unoptimized
                            />
                          </button>
                        )}
                      </div>
                    )
                  })
                : metadata?.cloudinary_gallery_images
                ? (() => {
                    const cloudinaryImages = JSON.parse(metadata.cloudinary_gallery_images)
                    return cloudinaryImages.map((imageUrl: string, index: number) => (
                      <div key={index} role="listitem">
                        <button
                          onClick={() => openLightbox(cloudinaryImages, index)}
                          className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg overflow-hidden"
                          style={{ maxHeight: '538px' }}
                          aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                            width={800}
                            height={500}
                            className="w-full object-cover rounded-lg cursor-pointer"
                            unoptimized
                          />
                        </button>
                      </div>
                    ))
                  })()
                : (() => {
                    const originalImages =
                      metadata?.project_gallery?.map(
                        (img) => `${img.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`
                      ) || []
                    return metadata?.project_gallery?.map((image, index) => (
                      <div key={index} role="listitem">
                        <button
                          onClick={() => openLightbox(originalImages, index)}
                          className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg overflow-hidden"
                          style={{ maxHeight: '538px' }}
                          aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                        >
                          <Image
                            src={`${image.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                            alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                            width={800}
                            height={500}
                            className="w-full object-cover rounded-lg cursor-pointer"
                            unoptimized
                          />
                        </button>
                      </div>
                    ))
                  })()}
            </div>
          </div>
        )}

        {resolvedNext && (
          <div style={{ marginTop: '96px' }}>
            <ArticleFooterNav next={resolvedNext} />
          </div>
        )}
      </div>

      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        projectTitle={metadata?.project_name || project.title}
      />
    </article>
  )
}
