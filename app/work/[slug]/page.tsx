// app/work/[slug]/page.tsx
import { getProject, getProjects, getAboutMe } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProjectDetail from '@/components/ProjectDetail'
import Navigation from '@/components/Navigation'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  
  return {
    title: `${project.metadata?.project_name || project.title} - Nicolas Ménard`,
    description: project.metadata?.description || `Portfolio project: ${project.title}`,
    openGraph: {
      title: `${project.metadata?.project_name || project.title} - Nicolas Ménard`,
      description: project.metadata?.description || `Portfolio project: ${project.title}`,
      images: project.metadata?.hero_image || project.metadata?.cloudinary_hero_image ? [
        {
          url: `${project.metadata?.hero_image || project.metadata?.cloudinary_hero_image}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: project.metadata?.project_name || project.title,
        }
      ] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const [project, aboutMe] = await Promise.all([
    getProject(slug),
    getAboutMe().catch(() => null)
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation aboutMe={aboutMe} />
      <main id="main-content" role="main">
        <ProjectDetail project={project} />
      </main>
    </div>
  )
}