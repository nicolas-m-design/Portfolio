import { Project } from '@/types'
import ProjectCard from '@/components/ProjectCard'

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {

  return (
    <section id="work" className="section bg-gray-50 dark:bg-black" aria-labelledby="work-heading">
      <div className="container">
        <div className="mb-16" data-aos="fade-up">
          <h2 id="work-heading" className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-gray-100 leading-tight pl-4 md:pl-0">
            Projects
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Portfolio projects">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={project.id} role="listitem" data-aos="fade-up" data-aos-delay="50">
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Work projects will appear here soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}