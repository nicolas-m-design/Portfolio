import { getAboutMe, getProjects } from '@/lib/cosmic'
import { manualProjects } from '@/lib/manual-projects'
import HomePage from '@/components/HomePage'
import Navigation from '@/components/Navigation'

export default async function Page() {
  try {
    // Fetch all data in parallel with error handling
    const [aboutMe, projects] = await Promise.all([
      getAboutMe().catch(() => null),
      getProjects().catch(() => [])
    ])

    // Prepend hand-authored projects that bypass the CMS. Their slugs must
    // resolve to a static route under `app/work/<slug>/page.tsx`.
    const mergedProjects = [...manualProjects, ...projects]

    return (
      <div className="min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation aboutMe={aboutMe} />
        <main id="main-content" role="main">
          <HomePage
            aboutMe={aboutMe}
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
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation aboutMe={null} />
        <main id="main-content" role="main">
        <HomePage
          aboutMe={null}
          projects={[]}
        />
        </main>
      </div>
    )
  }
}