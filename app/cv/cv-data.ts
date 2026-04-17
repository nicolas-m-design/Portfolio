// app/cv/cv-data.ts
//
// Single source of truth for CV content. Rendered to both the on-screen /cv
// page and the ATS-safe print output.
//
// Data-provenance notes:
//   - Where LinkedIn and the 2026 resume disagreed on titles or dates, the
//     LinkedIn export (more recent, self-authored) was treated as canonical.
//   - All metrics are user-supplied or sourced from the public portfolio site.

import type { CV } from './types'

export const cv: CV = {
  name: 'Nicolas Ménard',

  headline: {
    de: 'Design Engineer · Product Designer',
    ux: 'Senior Product Designer · Design systems, research & code',
  },

  summary: {
    de:
      'Design engineer and product designer with 10+ years shipping production UI across B2C, ' +
      'B2B SaaS, and AI products. I lead design systems in Figma and ship the React/TypeScript ' +
      'components behind them — most recently authoring DESIGN.md, a token-driven Figma↔React ' +
      'contract that lets AI agents execute design work without drift. Started my career as a ' +
      'front-end developer; have been closing the design–engineering gap ever since.',
    ux:
      'Senior product designer with 10+ years shipping products across education, energy, mobility, ' +
      'and AI. Led design systems and multi-country user research at EF, Electromaps, and Barry ' +
      'Energy. Unusual for a product designer: I also build the React/TypeScript behind the ' +
      'designs — my portfolio and design-system tooling (DESIGN.md) ship as code.',
  },

  contact: {
    email: 'hi@nicolasmenard.design',
    phone: '+41 77 812 74 69',
    location: 'Zurich, Switzerland',
    legalStatus: 'Swiss B Permit',
    links: [
      { label: 'Portfolio', href: 'https://nicolasmenard.design' },
      { label: 'GitHub', href: 'https://github.com/nicolas-m-design' },
      { label: 'LinkedIn', href: 'https://ch.linkedin.com/in/nicolas-menard-design' },
    ],
  },

  // Skill ordering is intentional — the first few groups are what a scanner
  // reads first. DE variant leads with code; UX variant leads with design.
  // The renderer reorders by `weight[variant]` ascending (1 = first).
  skills: [
    {
      label: 'Code',
      items: [
        'React 19',
        'TypeScript',
        'Next.js',
        'Tailwind CSS',
        'CSS / HTML',
        'Vite',
        'Framer Motion',
        'Git',
        'Node',
      ],
      weight: { de: 1, ux: 3 },
    },
    {
      label: 'Design systems',
      items: [
        'Design tokens',
        'Figma libraries & variables',
        'DESIGN.md (token contract)',
        'Component architecture',
        'Accessibility / WCAG',
        'Storybook',
      ],
      weight: { de: 2, ux: 2 },
    },
    {
      label: 'AI tooling',
      items: [
        'Claude Code',
        'Codex',
        'Gemini',
        'Figma MCP',
        'Cursor',
      ],
      weight: { de: 3, ux: 4 },
    },
    {
      label: 'Product design',
      items: [
        'Product design',
        'UX / UI',
        'Prototyping',
        'iOS / Android / Web',
        'Interaction design',
        'Motion',
        'Workshop facilitation',
        'DesignOps',
      ],
      weight: { de: 4, ux: 1 },
    },
    {
      label: 'Research',
      items: [
        'User research (qual & quant)',
        'Usability testing',
        'Multi-country research',
        'Personas, journey maps',
        'A/B testing',
      ],
      weight: { de: 5, ux: 5 },
    },
  ],

  experience: [
    {
      title: 'Freelance Product Designer & Design Engineer',
      company: 'Independent',
      location: 'Zurich, Switzerland',
      dates: 'Oct 2025 – Present',
      bullets: [
        {
          text:
            'Published DESIGN.md — a token-driven Figma↔React contract that keeps design and code in sync and lets AI agents execute design-system work without drift.',
          variants: ['de'],
        },
        {
          text:
            'Ship freelance product-design and design-engineering work for startups in tech, energy, mobility, and education — end-to-end from research to React components.',
        },
        {
          text:
            'Rebuilt my own portfolio as a Next.js 16 / React 19 / TypeScript site with hand-written case studies (incl. the Factory design-system piece).',
          variants: ['de'],
        },
      ],
    },

    {
      title: 'UX Lead',
      company: 'EF Education First',
      context:
        'International education company — language training, educational travel, and cultural-exchange programs.',
      location: 'Zurich, Switzerland',
      dates: 'May 2023 – Apr 2025',
      caseStudy: { label: `Case study: Unifying EF's Global Navigation`, href: '/work' },
      bullets: [
        {
          text:
            `Led a team of 4 designers at EF's Global Creative Studio, shaping the design-system and research strategy across several EF products.`,
        },
        {
          text:
            'Shipped 12 cross-product design-system components (Figma + React) adopted by 7 EF products worldwide — improving consistency, accessibility, and delivery speed across product teams.',
        },
        {
          text:
            'Authored the internal component documentation and usage guidelines that embedded the design system into day-to-day product workflows.',
        },
        {
          text:
            `Led multi-country user research delivering actionable insights to product leaders and executives across EF's global portfolio.`,
          variants: ['ux'],
        },
        {
          text:
            `Facilitated design workshops to reimagine EF.com's global and product navigation for desktop and mobile.`,
        },
      ],
    },

    {
      title: 'Lead User Researcher · Freelance',
      company: 'Electromaps',
      context:
        'Platform connecting EV drivers to a global network of charging stations, with in-app payments and real-time availability.',
      location: 'Remote',
      dates: 'Feb 2022 – May 2023',
      caseStudy: {
        label: 'Case study: Redesigning the EV Charging Experience',
        href: '/work',
      },
      bullets: [
        {
          text:
            'Led a team of 3 running qualitative + quantitative B2C research on the mobile app — 26 participants recruited across France, Spain, Portugal, and other European countries.',
        },
        {
          text:
            'Translated research findings into sitemaps, user flows, wireframes, mockups, and Figma prototypes used by the product team to prioritise features.',
        },
        {
          text:
            'Conducted moderated remote interviews and usability sessions; A/B-tested flow variants against business KPIs.',
          variants: ['ux'],
        },
        {
          text:
            'Presented insights and recommendations from executive to company-wide audiences.',
        },
      ],
    },

    {
      title: 'Product Designer & Researcher · Contract',
      company: 'Blackwood Seven (Kantar Group)',
      context:
        'AI-driven unified marketing-modelling platform for attribution, prediction, and optimisation of marketing/media plans across global brands.',
      location: 'Copenhagen, Denmark',
      dates: 'Jan 2023 – Mar 2023',
      bullets: [
        {
          text:
            'Balanced complex marketing data and predictive modelling against a simple, actionable interface for brand-health and media-strategy decisions.',
        },
        {
          text:
            'Delivered wireframes, prototypes, and data visualisations for attribution, optimisation, and scenario-planning workflows.',
        },
        {
          text:
            'Ran user research with marketing professionals and iterated on the B2B UI with PMs, engineers, and data scientists.',
          variants: ['ux'],
        },
        {
          text:
            'Ensured WCAG accessibility compliance across the new UI patterns.',
          variants: ['de'],
        },
      ],
    },

    {
      title: 'User Experience Designer · Freelance',
      company: 'LightOn — Muse.ai',
      context:
        'State-of-the-art multilingual LLMs (5 languages) powering conversational AI, copywriting, classification, and semantic search.',
      location: 'Remote',
      dates: 'Aug 2022 – Oct 2022',
      bullets: [
        {
          text:
            'Redesigned the muse.lighton.ai web interface end-to-end using a responsive-design approach — from interaction concepts to production-ready high-fidelity mockups.',
        },
        {
          text:
            'Rewrote the API documentation sub-pages so both technical and non-technical audiences could use the API with less friction.',
        },
        {
          text: 'Realigned brand identity and copy across the site to match UX requirements.',
        },
      ],
    },

    {
      title: 'User Experience Researcher · Freelance',
      company: 'Allianz Technology',
      context:
        'IT backbone of the Allianz Group — infrastructure, applications, and services across Allianz entities.',
      location: 'Remote',
      dates: 'Apr 2022 – Jul 2022',
      bullets: [
        {
          text:
            'Conducted B2B user research in France feeding the global research team — in-depth interviews, insight delivery to executives, workshop facilitation.',
        },
        {
          text:
            'Facilitated cross-functional workshops aligning research and product teams on workflow priorities.',
        },
      ],
    },

    {
      title: 'User Research Teacher',
      company: 'Talent Garden / KEA Innovation School',
      location: 'Copenhagen, Denmark',
      dates: 'Feb 2022 – Mar 2022',
      bullets: [
        {
          text:
            'Taught UX fundamentals — user research, heuristics, cognitive-psychology laws, and usability-testing methodology — to future UX designers on the professional-certification track.',
        },
      ],
    },

    {
      title: 'User Experience Researcher',
      company: 'Barry Energy',
      context:
        '100% digital electricity supplier providing spot (dynamic) pricing so customers can optimise consumption by price or CO₂ emissions.',
      location: 'Copenhagen, Denmark',
      dates: 'Dec 2020 – Nov 2021',
      caseStudy: {
        label: 'Case study: Measuring What Matters — 52% support-ticket reduction',
        href: '/work',
      },
      bullets: [
        {
          text:
            'Led qualitative + quantitative research across France and Denmark; the resulting redesign reduced support tickets by 52% over 3 months.',
        },
        {
          text:
            'Built user-research communities from 0 → 600+ members across two countries — a permanent co-creation and testing pool that de-risked every subsequent feature.',
        },
        {
          text:
            'Defined UX OKRs with the product team; developed 4 multi-country personas and end-to-end experience maps as the research foundation for the product roadmap.',
          variants: ['ux'],
        },
        {
          text:
            'Worked closely with the engineering team on the Barry app and API — iterated MVP prototypes alongside user tests, ran data analysis to improve the API.',
          variants: ['de'],
        },
        {
          text:
            'Automated user-feedback collection and executive reporting via Zapier + Slack; copywritten the app in French and English.',
        },
      ],
    },

    {
      title: 'User Experience Designer',
      company: 'Stanley Robotics',
      context:
        'Autonomous parking robot providing valet-parking service across airport car parks.',
      location: 'Paris, France',
      dates: 'Nov 2015 – Dec 2020',
      bullets: [
        {
          text:
            'Employee #5 as the company scaled to 70+ — designed the B2B2C service end-to-end across booking, kiosk, car-handoff, and ops touchpoints, deployed at CDG (Paris), LYS (Lyon), and LGW (London Gatwick) with ~200 cars parked daily.',
        },
        {
          text:
            'Led client design workshops and set UX acceptance criteria across design, engineering, and domain-expert teams.',
        },
        {
          text:
            'Ran independent research across all service touchpoints — field visits, ethnography, surveys, benchmarks, and server-log analysis.',
          variants: ['ux'],
        },
      ],
    },

    {
      title: 'Front End Developer / Webdesigner',
      company: 'Erashome',
      context:
        'B2C service for international students arriving in Paris — housing, banking, language courses, and administrative support.',
      location: 'Paris, France',
      dates: 'Sep 2013 – Oct 2015',
      bullets: [
        {
          text:
            'Designed and coded the full-stack responsive website in HTML/CSS/JS — built an Airbnb-style apartment finder, a multi-step booking workflow, and a profile-setup flow for students arriving in Paris.',
          variants: ['de'],
        },
        {
          text:
            'Designed the B2C responsive website and core flows (apartment finder, booking, profile setup); produced IA, user journeys, and interaction guidelines.',
          variants: ['ux'],
        },
      ],
    },
  ],

  education: [
    {
      degree: 'Master of UX Design',
      school: `L'École Multimédia`,
      location: 'Paris, France',
      dates: '2015 – 2017',
      detail:
        'Human-centred and interface design — user-centred design, participatory design, prototyping, information visualisation, service design.',
    },
    {
      degree: 'Bachelor of Multimedia — Experience Design',
      school: 'IESA art & culture',
      location: 'Paris, France',
      dates: '2013 – 2015',
    },
  ],

  awards: [
    { title: 'Best UX Designer', issuer: 'IESA Bachelor' },
    { title: 'Best Project Strategy', issuer: 'IESA Bachelor' },
  ],

  certifications: [
    'Data-Driven Design: Quantitative Research for UX',
    'UX Management: Strategy and Tactics',
    'Manager Training (EF Education First)',
  ],

  publications: [
    {
      title: 'Working as a UX design team of one in a startup environment',
    },
    {
      title: `Design d'Expérience Utilisateur : Principes et méthodes UX`,
      venue: 'Quoted in the book by Sylvie Daumal',
    },
    {
      title: 'Accessible Parking Gets Inclusive with Robot Parking',
    },
    {
      title: 'Test utilisateur : Par où commencer',
      venue: 'Newflux',
    },
  ],

  languages: ['French (native)', 'English (full professional)'],

  interests: ['Climbing', 'Ski touring', 'Running', 'Cycling', 'Paragliding'],
}
