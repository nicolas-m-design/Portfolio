import { WorkExperience } from '@/types'
import ExperienceCard from '@/components/ExperienceCard'

interface ExperienceProps {
  experiences: WorkExperience[]
}

export default function Experience({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="section bg-white dark:bg-black" aria-labelledby="experience-heading">
      <div className="container">
        <div className="mb-16" data-aos="fade-up">
          <h2 id="experience-heading" className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-gray-100 leading-tight pl-4 md:pl-0">
            Experience
          </h2>
        </div>
        
        <div>
          <div className="space-y-8" role="list" aria-label="Work experience timeline">
            {experiences.map((experience, index) => (
              <div key={experience.id} role="listitem" data-aos="fade-up" data-aos-delay={index * 50}>
                <ExperienceCard 
                  experience={experience} 
                  isLast={index === experiences.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}