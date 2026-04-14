import { Project } from '@/types'

/**
 * Hand-authored projects that bypass the Cosmic CMS.
 *
 * These entries are merged into the projects list returned by `getProjects()`
 * in `app/page.tsx` so they appear in the home-page grid. Each slug must
 * resolve to a static Next.js route under `app/work/<slug>/page.tsx`, which
 * takes precedence over the dynamic `[slug]` route at runtime.
 */
export const manualProjects: Project[] = [
  {
    id: 'manual-factory-design-system',
    slug: 'factory-design-system',
    title: 'Keeping Figma and React in Sync with DESIGN.md',
    type: 'projects',
    created_at: '2026-04-08T00:00:00Z',
    modified_at: '2026-04-08T00:00:00Z',
    metadata: {
      project_name: 'Keeping Figma and React in Sync with DESIGN.md',
      description_short:
        'A token-driven design system built in lockstep across Figma and React, where a single markdown contract lets AI agents do the execution without drift.',
      thumbnail: '/case-studies/factory-design-system/cover.svg',
      featured_image: '/case-studies/factory-design-system/cover.svg',
      project_type: ['Design System', 'AI + Design', 'Figma MCP'],
      project_duration: '3 weeks',
      company: 'Self-initiated',
      tools_used: [
        'Figma',
        'Figma MCP',
        'Claude Code',
        'Codex',
        'React 19',
        'Vite',
        'TypeScript',
      ],
    },
  },
]
