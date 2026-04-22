import { getAboutMe, getWorkExperience, getProjects } from '@/lib/cosmic'
import { manualProjects } from '@/lib/manual-projects'
import HomePage from '@/components/HomePage'
import Navigation from '@/components/Navigation'

export default async function Page() {
  try {
    // Fetch all data in parallel with error handling
    const [aboutMe, workExperience, projects] = await Promise.all([
      getAboutMe().catch(() => null),
      getWorkExperience().catch(() => []),
      getProjects().catch(() => [])
    ])

    // Prepend hand-authored projects that bypass the CMS. Their slugs must
    // resolve to a static route under `app/work/<slug>/page.tsx`.
    const mergedProjects = [...manualProjects, ...projects]

    return (
      <div className="min-h-screen">
        <a href="#work" className="skip-link">
          Skip to main content
        </a>
        <Navigation aboutMe={aboutMe} />
        <main id="main-content" role="main">
          <HomePage
            aboutMe={aboutMe}
            workExperience={workExperience}
            projects={mergedProjects}
          />
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading page:', error)
    // Fallback: show hero with placeholder sections
    return (
      <div className="min-h-screen">
        <a href="#work" className="skip-link">
          Skip to main content
        </a>
        <Navigation aboutMe={null} />
        <main id="main-content" role="main">
        <HomePage
          aboutMe={null}
          workExperience={[]}
          projects={[]}
        />
        
        {/* Placeholder sections when data fails */}
        <section id="work" className="py-16 bg-white dark:bg-black">
          <div className="container">
            <h2 className="text-2xl font-normal text-center mb-12 dark:text-gray-100">Work</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">Loading work...</p>
          </div>
        </section>

        <section id="experience" className="py-16 bg-gray-50 dark:bg-black">
          <div className="container">
            <h2 className="text-2xl font-normal mb-12 dark:text-gray-100">Experience</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading experience...</p>
          </div>
        </section>

        <section id="contact" className="py-16 bg-gray-50 dark:bg-black">
          <div className="container">
            <h2 className="text-2xl font-normal mb-12 dark:text-gray-100">Contact</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading contact information...</p>
          </div>
        </section>
        </main>
      </div>
    )
  }
}