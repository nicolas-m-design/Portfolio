'use client'

import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react'
import { Project } from '@/types'
import Lightbox from './Lightbox'
import { getProjects } from '@/lib/cosmic'

interface ProjectDetailProps {
  project: Project
}

const PROSE_CLASS =
  'prose max-w-none text-gray-700 ' +
  '[&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 ' +
  '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 ' +
  '[&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 ' +
  '[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-6 [&_li]:mb-2 ' +
  '[&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-6 ' +
  '[&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 ' +
  '[&_strong]:font-medium ' +
  '[&_blockquote]:bg-gray-100 [&_blockquote]:p-6 [&_blockquote]:rounded-lg [&_blockquote]:text-lg [&_blockquote]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:my-8 [&_blockquote]:not-italic [&_blockquote_p]:text-lg ' +
  '[&_table]:w-full [&_table]:my-8 [&_table]:bg-gray-50 [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-gray-200 ' +
  '[&_thead]:bg-gray-100 [&_th]:p-4 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 ' +
  '[&_td]:p-4 [&_td]:border-t [&_td]:border-gray-200 [&_tr]:hover:bg-gray-100 ' +
  '[&_img]:rounded-lg [&_img]:max-h-[538px] [&_img]:object-cover ' +
  '[&_a]:text-primary-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-700 ' +
  '[&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono'

function getProjectTypeLabel(projectType: { key: string; value: string } | string[] | undefined): string {
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
  const [nextProject, setNextProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects()
        const currentIndex = projectsData.findIndex(p => p.id === project.id)
        if (currentIndex !== -1 && projectsData.length > 1) {
          const nextIndex = (currentIndex + 1) % projectsData.length
          setNextProject(projectsData[nextIndex])
        } else if (projectsData.length > 0) {
          setNextProject(projectsData.find(p => p.id !== project.id) || null)
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
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  const previousImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  const renderImage = (src: string, alt: string, group: string[], index: number) => (
    <button
      onClick={() => openLightbox(group, index)}
      className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg mb-4 block"
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

  // Collect quick-facts metadata
  const quickFacts: { label: string; values: string[] }[] = []
  if (metadata?.company || metadata?.client_company) {
    quickFacts.push({ label: 'Company', values: [metadata?.company || metadata?.client_company || ''] })
  }
  if (metadata?.project_duration) {
    quickFacts.push({ label: 'Duration', values: [metadata.project_duration] })
  }
  if (metadata?.tools_used && metadata.tools_used.length > 0) {
    quickFacts.push({ label: 'Tools', values: metadata.tools_used })
  }

  // Build sections array for dividers
  const sections: React.ReactNode[] = []

  // Section: Overview
  if (metadata?.project_overview || metadata?.project_overview_image || metadata?.project_overview_image_2) {
    const overviewImages = [metadata?.project_overview_image, metadata?.project_overview_image_2].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="overview" className="py-16 md:py-18">
        {overviewImages.length > 0 && (
          <div className="mb-10">
            {overviewImages.map((src, i) => <div key={i}>{renderImage(src, `Overview image ${i + 1} for ${metadata?.project_name || project.title}`, overviewImages, i)}</div>)}
          </div>
        )}
        {metadata?.project_overview && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.project_overview}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Section: Challenge & Research
  if (metadata?.challenge_and_research || metadata?.challenge_and_research_image || metadata?.challenge_and_research_image_2 || metadata?.challenge_and_research_image_3) {
    const challengeImages = [metadata?.challenge_and_research_image, metadata?.challenge_and_research_image_2, metadata?.challenge_and_research_image_3].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="challenge" className="py-16 md:py-18">
        {challengeImages.length > 0 && (
          <div className="mb-10">
            {challengeImages.map((src, i) => <div key={i}>{renderImage(src, `Challenge & Research image ${i + 1} for ${metadata?.project_name || project.title}`, challengeImages, i)}</div>)}
          </div>
        )}
        {metadata?.challenge_and_research && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.challenge_and_research}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Section: Design Process
  if (metadata?.design_process || metadata?.design_process_image || metadata?.design_process_image_2 || metadata?.design_process_image_3) {
    const processImages = [metadata?.design_process_image, metadata?.design_process_image_2, metadata?.design_process_image_3].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="process" className="py-16 md:py-18">
        {processImages.length > 0 && (
          <div className="mb-10">
            {processImages.map((src, i) => <div key={i}>{renderImage(src, `Design Process image ${i + 1} for ${metadata?.project_name || project.title}`, processImages, i)}</div>)}
          </div>
        )}
        {metadata?.design_process && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.design_process}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Section: Solution
  if (metadata?.solution || metadata?.solution_image || metadata?.solution_image_2 || metadata?.solution_image_3) {
    const solutionImages = [metadata?.solution_image, metadata?.solution_image_2, metadata?.solution_image_3].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="solution" className="py-16 md:py-18">
        {solutionImages.length > 0 && (
          <div className="mb-10">
            {solutionImages.map((src, i) => <div key={i}>{renderImage(src, `Solution image ${i + 1} for ${metadata?.project_name || project.title}`, solutionImages, i)}</div>)}
          </div>
        )}
        {metadata?.solution && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.solution}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Section: Implementation & Results
  if (metadata?.implementation_and_results || metadata?.implementation_and_results_image || metadata?.implementation_and_results_image_2) {
    const implImages = [metadata?.implementation_and_results_image, metadata?.implementation_and_results_image_2].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="implementation" className="py-16 md:py-18">
        {implImages.length > 0 && (
          <div className="mb-10">
            {implImages.map((src, i) => <div key={i}>{renderImage(src, `Implementation & Results image ${i + 1} for ${metadata?.project_name || project.title}`, implImages, i)}</div>)}
          </div>
        )}
        {metadata?.implementation_and_results && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.implementation_and_results}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Section: Reflection
  if (metadata?.reflection || metadata?.reflection_image || metadata?.reflection_image_2) {
    const reflectionImages = [metadata?.reflection_image, metadata?.reflection_image_2].filter((img): img is string => Boolean(img))
    sections.push(
      <section key="reflection" className="py-16 md:py-18">
        {reflectionImages.length > 0 && (
          <div className="mb-10">
            {reflectionImages.map((src, i) => <div key={i}>{renderImage(src, `Reflection image ${i + 1} for ${metadata?.project_name || project.title}`, reflectionImages, i)}</div>)}
          </div>
        )}
        {metadata?.reflection && (
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.reflection}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  // Fallback: plain description
  if (sections.length === 0 && metadata?.description) {
    sections.push(
      <section key="description" className="py-16 md:py-18">
        <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: metadata.description }} />
      </section>
    )
  }

  // Fallback: challenge + solution (old format)
  if (sections.length === 0) {
    if (metadata?.challenge) {
      sections.push(
        <section key="challenge-old" className="py-16 md:py-18">
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <p>{metadata.challenge}</p>
          </div>
        </section>
      )
    }
    if (metadata?.solution) {
      const solutionImages = [metadata?.solution_image].filter((img): img is string => Boolean(img))
      sections.push(
        <section key="solution-old" className="py-16 md:py-18">
          {solutionImages.length > 0 && (
            <div className="mb-10">
              {solutionImages.map((src, i) => <div key={i}>{renderImage(src, `Solution image for ${metadata?.project_name || project.title}`, solutionImages, i)}</div>)}
            </div>
          )}
          <div className={PROSE_CLASS} style={{ lineHeight: 1.8, maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {metadata.solution}
            </ReactMarkdown>
          </div>
        </section>
      )
    }
  }

  return (
    <article className="pt-36 pb-16">
      <style jsx>{`
        .prose h2 {
          font-size: clamp(23px, 3vw, 32px);
        }
        .prose h4 {
          margin-top: 2.2rem !important;
        }
      `}</style>

      {/* Hero section */}
      <div className="container" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="mb-8" data-aos="fade-up" data-aos-delay="50">
          {/* Eyebrow */}
          <p
            className="text-gray-500 font-medium tracking-widest uppercase mb-4"
            style={{ fontSize: '12px', letterSpacing: '0.1em' }}
          >
            {getProjectTypeLabel(metadata?.project_type)}
          </p>

          {/* Title */}
          <h1
            className="font-bold text-gray-900"
            style={{
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginTop: 0,
              marginBottom: '1.25rem',
            }}
          >
            {metadata?.project_name || project.title}
          </h1>

          {/* Tagline */}
          {metadata?.description_short && (
            <div
              className="text-gray-600 text-lg"
              style={{ lineHeight: 1.6, maxWidth: '760px', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: metadata.description_short }}
            />
          )}
        </div>

        {/* Quick facts row */}
        {quickFacts.length > 0 && (
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12" data-aos="fade-up" data-aos-delay="100">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex items-baseline gap-2">
                <span className="text-gray-500 text-sm font-medium">{fact.label}</span>
                <span className="flex flex-wrap gap-1.5">
                  {fact.values.map((v) => (
                    <span key={v} className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-sm rounded">
                      {v}
                    </span>
                  ))}
                </span>
              </div>
            ))}

            {/* Links inline */}
            {(metadata?.live_url || metadata?.live_url_2 || metadata?.case_study_url) && (
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500 text-sm font-medium">Links</span>
                <span className="flex flex-wrap gap-2">
                  {metadata?.live_url && (
                    <a href={metadata.live_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-medium underline underline-offset-2">
                      {metadata.live_url_text || 'Live Project'}
                    </a>
                  )}
                  {metadata?.live_url_2 && (
                    <a href={metadata.live_url_2} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-medium underline underline-offset-2">
                      {metadata.live_url_2_text || 'Live Project 2'}
                    </a>
                  )}
                  {metadata?.case_study_url && (
                    <a href={metadata.case_study_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-medium underline underline-offset-2">
                      Case Study
                    </a>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full width hero image */}
      {(metadata?.hero_image || metadata?.cloudinary_hero_image) && (
        <div className="container mb-4" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }} data-aos="fade-up" data-aos-delay="100">
          <Image
            src={metadata.hero_image || metadata.cloudinary_hero_image}
            alt={`Hero image for ${metadata?.project_name || project.title} project`}
            width={1600}
            height={928}
            className="w-full object-cover rounded-lg"
            style={{ height: '464px' }}
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content sections with dividers */}
      <div className="container" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="divide-y divide-gray-200">
          {sections}
        </div>

        {/* Project gallery */}
        {(() => {
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
            if (metadata.hero_image) contentSectionImages.push(metadata.hero_image)
            if (metadata.cloudinary_hero_image) contentSectionImages.push(metadata.cloudinary_hero_image)
            if (metadata.project_overview_image) contentSectionImages.push(metadata.project_overview_image)
            if (metadata.project_overview_image_2) contentSectionImages.push(metadata.project_overview_image_2)
            if (metadata.challenge_and_research_image) contentSectionImages.push(metadata.challenge_and_research_image)
            if (metadata.challenge_and_research_image_2) contentSectionImages.push(metadata.challenge_and_research_image_2)
            if (metadata.challenge_and_research_image_3) contentSectionImages.push(metadata.challenge_and_research_image_3)
            if (metadata.design_process_image) contentSectionImages.push(metadata.design_process_image)
            if (metadata.design_process_image_2) contentSectionImages.push(metadata.design_process_image_2)
            if (metadata.design_process_image_3) contentSectionImages.push(metadata.design_process_image_3)
            if (metadata.solution_image) contentSectionImages.push(metadata.solution_image)
            if (metadata.solution_image_2) contentSectionImages.push(metadata.solution_image_2)
            if (metadata.solution_image_3) contentSectionImages.push(metadata.solution_image_3)
            if (metadata.implementation_and_results_image) contentSectionImages.push(metadata.implementation_and_results_image)
            if (metadata.implementation_and_results_image_2) contentSectionImages.push(metadata.implementation_and_results_image_2)
            if (metadata.reflection_image) contentSectionImages.push(metadata.reflection_image)
            if (metadata.reflection_image_2) contentSectionImages.push(metadata.reflection_image_2)
          }

          const filteredIndividualImages = individualImages.filter(imageUrl => !contentSectionImages.includes(imageUrl))
          const allImages = Array.from(new Set(filteredIndividualImages))

          const hasCloudinaryGallery = metadata?.cloudinary_gallery_images && JSON.parse(metadata.cloudinary_gallery_images).length > 0
          const hasOriginalGallery = metadata?.project_gallery && metadata.project_gallery.length > 0
          const hasIndividualImages = filteredIndividualImages.length > 0
          const hasAnyImages = allImages.length > 0

          return (hasCloudinaryGallery || hasOriginalGallery || hasIndividualImages) && (
            <div className="py-16 md:py-18 border-t border-gray-200">
              <div className="space-y-24" role="list" aria-label="Project gallery images">
                {hasAnyImages ? (
                  allImages.map((imageUrl: string, index: number) => {
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
                            onClick={() => openLightbox(allImages.filter(url => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)), allImages.filter(url => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)).indexOf(imageUrl))}
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
                ) : metadata?.cloudinary_gallery_images ? (
                  (() => {
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
                ) : (
                  (() => {
                    const originalImages = metadata.project_gallery?.map(img => `${img.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`) || []
                    return metadata.project_gallery?.map((image, index) => (
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
                  })()
                )}
              </div>
            </div>
          )
        })()}

        {/* Article footer navigation */}
        <nav className="flex items-center justify-between pt-12 mt-4 border-t border-gray-200">
          <Link
            href="/#work"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to all work
          </Link>
          {nextProject && (
            <Link
              href={`/work/${nextProject.slug}`}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Next Project →
            </Link>
          )}
        </nav>
      </div>

      {/* Lightbox */}
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
