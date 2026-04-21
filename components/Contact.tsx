import { AboutMe } from '@/types'
import SocialLinks from '@/components/SocialLinks'

interface ContactProps {
  aboutMe: AboutMe | null
}

export default function Contact({ aboutMe }: ContactProps) {
  const metadata = aboutMe?.metadata

  // If no aboutMe data, show a fallback
  if (!aboutMe || !metadata) {
    return (
      <section id="contact" className="section bg-gray-50 dark:bg-black">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-gray-100 mb-4">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Contact information will be available soon.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section bg-gray-50 dark:bg-black">
      <div className="container">
        <div className="mb-16 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start" data-aos="fade-up">
          {metadata?.profile_image && (
            <div className="hidden lg:block lg:w-80 flex-shrink-0 lg:order-1">
              <img
                src={typeof metadata.profile_image === 'string'
                  ? metadata.profile_image
                  : `${metadata.profile_image.imgix_url}?w=400&auto=format,compress`}
                alt={metadata?.full_name || 'Profile'}
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          )}
          <div className="flex-1 lg:order-2">
            <h2 className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-gray-100 mb-4 leading-tight pl-4 md:pl-0">
              About me
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-6 space-y-4 px-4 md:px-0">
              <p>
                I'm a product designer with 10+ years shipping products across education, energy, mobility, and AI/robotics — turning complex challenges into meaningful, measurable outcomes.
              </p>
              <p>
                Most recently, I led a team of designers at EF's Global Creative Studio, shaping the Design System and User Research strategy with product teams at EF. I helped grow the team, improved workflows, and delivered business-critical initiatives across digital and service touchpoints. I thrive at the intersection of product, tech and brand — aligning cross-functional teams, building design and research ops, and driving clarity in complex environments.
              </p>
              <p>
                Before EF, I designed autonomous valet parking experiences at Stanley Robotics (employee #5, scaled to 70+) and reimagined EV charging flows at Barry Energy and Electromaps based on multi-country user research.
              </p>
              <p>
                Outside of work, you'll find me climbing mountains, ski touring, and satisfying my never ending curiosity learning new things.
              </p>
            </div>
          </div>
        </div>

          <div className="flex flex-col md:flex-row gap-12 items-start lg:pl-[calc(20rem+4rem)]">
            {/* Profile image - mobile only */}
            <div className="lg:hidden" data-aos="fade-up" data-aos-delay="50">
              {metadata?.profile_image && (
                <div className="relative w-full md:w-80">
                  <img
                    src={typeof metadata.profile_image === 'string'
                      ? metadata.profile_image
                      : `${metadata.profile_image.imgix_url}?w=400&auto=format,compress`}
                    alt={metadata?.full_name || 'Contact'}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            <div className="w-full md:flex-1" data-aos="fade-up" data-aos-delay="100">
              <div className="space-y-6">
                {metadata?.email && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email</h3>
                      <a 
                        href={`mailto:${metadata.email}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        {metadata.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {metadata?.phone && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Phone</h3>
                      <a 
                        href={`tel:${metadata.phone}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        {metadata.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {metadata?.location && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Location</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-6">{metadata.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center md:justify-start">
                  <SocialLinks aboutMe={aboutMe} />
                </div>
                
                {metadata?.available_for_work !== undefined && (
                  <div className="pt-6 flex justify-center md:justify-start">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      metadata.available_for_work
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        metadata.available_for_work ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      {metadata.available_for_work 
                        ? 'Available for new opportunities' 
                        : 'Currently not available for work'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}