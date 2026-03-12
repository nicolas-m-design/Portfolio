import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getAboutMe } from '@/lib/cosmic'
import { Experiment } from '@/components/ExperimentCard'
import ExperimentsGrid from '@/components/ExperimentsGrid'

export const metadata: Metadata = {
  title: 'Experiments - Nicolas Ménard',
  description: 'Design experiments and explorations by Nicolas Ménard.',
}

const experiments: Experiment[] = [
  {
    slug: 'animated-wordmark',
    title: 'Animated Wordmark',
    description: 'Variable font wordmark with a traveling weight wave, neon glow, and physics-based spark particles',
    thumbnail: '/experiments/animated-wordmark.png',
    tags: ['Variable Fonts', 'Canvas', 'CSS'],
  },
  {
    slug: 'solana-transactions-pulse',
    title: 'Solana Transactions Pulse',
    description: 'A real-time visualization of Solana blockchain transactions',
    thumbnail: '/experiments/solana-transactions-pulse.png',
    tags: ['3D / WebGL', 'Generative', 'Blockchain'],
  },
  {
    slug: 'pixel-waves',
    title: 'Pixel Waves',
    description: 'An animated canvas of pixel waves',
    thumbnail: '/experiments/pixel-waves.png',
    tags: ['Pixel art', 'Animation'],
  },
  {
    slug: 'fluid-cursor',
    title: 'Fluid Cursor',
    description: 'An interactive fluid simulation that responds to cursor movement',
    thumbnail: '/experiments/fluid-cursor.png',
    tags: ['Shader', 'Three.js', 'WebGL'],
  },
]

export default async function ExperimentsPage() {
  const aboutMe = await getAboutMe().catch(() => null)

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation aboutMe={aboutMe} />
      <main id="main-content" role="main" className="pt-48 pb-16">
        <div className="container">
          <div className="mb-16" data-aos="fade-up">
            <h1 className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight max-w-[960px]">
              I like building things just to see if they work. These are small experiments made with AI tools where I try ideas and learn along the way.
            </h1>
          </div>

          <ExperimentsGrid experiments={experiments} />
        </div>
      </main>
    </div>
  )
}
