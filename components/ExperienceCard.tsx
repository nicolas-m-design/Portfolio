import { WorkExperience } from '@/types'

interface ExperienceCardProps {
  experience: WorkExperience
  isLast: boolean
}

export default function ExperienceCard({ experience, isLast }: ExperienceCardProps) {
  const { metadata } = experience

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Present'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <article className="relative" role="article">
      {/* Content */}
      <div 
        className="card pl-4 md:pl-6 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus:outline-none transition-all duration-300" 
        tabIndex={0}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-relaxed">
              {metadata?.job_title}
            </h3>
            <div className="text-lg font-medium text-primary-600 mb-2">
              {metadata?.company}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {metadata?.employment_type && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {metadata.employment_type.value}
                </span>
              )}
              
              <span>
                {formatDate(metadata?.start_date)} - {formatDate(metadata?.end_date)}
              </span>
              
              {metadata?.location && (
                <span aria-label={`Location: ${metadata.location}`}>📍 {metadata.location}</span>
              )}
              
              {metadata?.current_position && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                  Current
                </span>
              )}
            </div>
          </div>
          
          {metadata?.company_logo && (
            <img
              src={`${metadata.company_logo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
              alt={`${metadata?.company} company logo`}
              width="60"
              height="60"
              className="w-12 h-12 object-contain rounded-lg ml-4"
              loading="lazy"
            />
          )}
        </div>
        
        {metadata?.job_description && (
          <div 
            className="prose max-w-none text-gray-700 dark:text-gray-300 mb-4"
            dangerouslySetInnerHTML={{ __html: metadata.job_description }}
          />
        )}
        
        {metadata?.key_achievements && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Achievements:</h4>
            <div
              className="prose prose-ul:list-disc prose-li:ml-0 max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: metadata.key_achievements }}
            />
          </div>
        )}
      </div>
    </article>
  )
}