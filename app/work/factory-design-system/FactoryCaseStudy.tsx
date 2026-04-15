'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ArticleMeta from '@/components/project-detail/ArticleMeta'
import ArticleFooterNav from '@/components/project-detail/ArticleFooterNav'
import EmbeddedDemo from '@/components/project-detail/EmbeddedDemo'
import CursorDesignMdFrame from '@/components/CursorDesignMdFrame'
import ContractFlowDiagram from '@/components/project-detail/ContractFlowDiagram'
import TokenPipelineDiagram from '@/components/project-detail/TokenPipelineDiagram'
import ContractTriangleDiagram from '@/components/project-detail/ContractTriangleDiagram'
import AgentTraceCard from '@/components/project-detail/AgentTraceCard'

// ---------- Article metadata ----------

const PROJECT_NAME = 'Keeping Figma and React in Sync with DESIGN.md'
const TAGLINE =
  'A token-driven design system built in parallel across Figma and React, where a single markdown contract lets AI agents do the execution without drift.'

const META = {
  role: 'Solo designer-engineer',
  stack: ['Figma', 'Figma MCP', 'Claude Code', 'Codex', 'React 19', 'Vite', 'TypeScript'],
  date: 'April 2026',
}

const LINKS = {
  github: 'https://github.com/nicolas-m-design/factory-design-system',
  figma: 'https://www.figma.com/design/8MJzvdHYtuUoVg0cwVm3mW/Factory-Design-System',
  liveDemo: '/experiments/token-brand-system',
  stitch: 'https://stitch.withgoogle.com/docs/design-md/overview',
  jocelyn: 'https://www.jocelyn-lin.com/dls-2026-case-study.html',
}

// ---------- Article body (markdown) ----------

const OVERVIEW = `
Most design systems die at the Figma → code handoff. The file drifts, the tokens fork, the components get rebuilt twice, and within six months nobody can answer a simple question: *where is the truth?*

Factory is an experiment in making that handoff automatic. It is a token-driven [spec app](${LINKS.liveDemo}) built around one canonical visual language – Geist Mono, orange and ink, square edges – where every primitive, semantic alias, and component contract lives in machine-readable files that both humans and AI agents can execute against.

### What's in it

- **12 routes** (1 overview, 4 foundations, 7 components)
- **14 component families** – Button, InputField, Select, Textarea, Checkbox, Radio, Toggle, Link, Badge, Alert, Card, Tab, and two form primitives
- **53 primitive tokens** and **92 semantic aliases**
- **33 curated Remix icons** (no open-ended icon library)
- **7 test suites** covering token drift, component behavior, docs acceptance, and jest-axe accessibility smoke tests
- **One \`DESIGN.md\` file** governing the whole thing

Four pillars shape every decision: **Source** (Figma variables and components), **Method** (primitive → semantic → component, enforced in both directions), **Identity** (orange, ink, square edges, Geist Mono, no exceptions), and **Output** (generated tokens and inspectable specs, not screenshots).

The stack is intentionally small. Figma and Figma MCP handle design input. Claude Code and Codex handle execution – reading the contract, diffing Figma against code, writing patches, and running the test suite. React 19 + Vite + TypeScript is the runtime. Every other choice flows from one rule: *the markdown contract is the source of truth, and everything else is its expression.* This article is a case study of what that looks like in practice, what it took to build, and what I'd do differently next time.
`

const CHALLENGE = `
## The problem: drift is structural, not accidental

Figma and code drift because they each store the same truth in two different languages. Designers edit pixels; developers edit values; neither side sees the other's edit until a handoff meeting, and by then the drift is already shipped. Every design system I've worked on has had this same rot at the seams.

**Tokens are usually a patch, not a spine.** The standard fix is to ship a \`tokens.json\` late in the project and hope the Figma variables mirror it. They rarely do. Figma tokens get renamed to match Figma's ergonomics, code tokens get renamed to match build-tool ergonomics, and the JSON becomes a third file that neither side owns. You end up with three sources of truth and no contract.

**So what would a real contract look like?** I wanted to find out whether a markdown file – human-readable but machine-parseable, versioned in git, and explicitly opinionated – could be the canonical spec that both Figma and production code obey. Google's [Stitch](${LINKS.stitch}) describes a methodology called \`design.md\` in this direction. Jocelyn Lin's [DLS-2026 case study](${LINKS.jocelyn}) explores a parallel idea, using AI to generate tokens from a brand brief.

I wanted to push further: not just use a markdown spec to *generate* a system, but treat it as the contract AI agents *execute against* every time the system changes. Factory is the test bed for that idea.
`

const PROCESS = `
## The design process: constraints first, code second

Three moves, in order.

### 1. Write DESIGN.md before writing any code

The first file I committed to the repo was a markdown file that described every rule the system would enforce – visual language, accessibility policy, artifact governance, token taxonomy, route contract, testing guardrails. No components, no tokens, no CSS. Just rules. Roughly 320 lines, opinionated, quotable.

That file became the brief I hand to every AI agent that touches the system. When Claude Code starts a task, the first thing it reads is \`DESIGN.md\`. When Codex generates a component stub, it checks \`DESIGN.md\`'s visual rules. When a new contributor lands in the repo, they read \`DESIGN.md\` before touching a line of code. **The contract is the brief is the spec.**

Garry Tan's April 11, 2026 article, ["Thin Harness, Fat Skills"](https://x.com/i/article/2042922188924424198), gave me a useful name for the pattern I was already converging on: keep the harness small, and move reusable judgment into explicit markdown contracts and runbooks. In Factory, that means the harness reads the repo, loads the right files, runs narrow tools, and verifies deterministic outputs, while \`DESIGN.md\`, the Figma checklist, and small task-specific docs hold the process that should persist across tasks.

### 2. Force brutal constraints to shrink the surface

AI agents reason better against opinionated rules than polite suggestions. So I wrote the rules as manifestos:

- Geist Mono is the system voice across UI, labels, and headings.
- Orange is the only brand accent.
- Blue is reserved for informational semantics only.
- Radius: one value. No exceptions.

> Infrastructure with guardrails, not documentation. Docs describe; infrastructure enforces. If a rule can't fail a build, it isn't a rule.

Radius is the proof. There is exactly one radius token in the system (\`0px\`), pinned on the Radius foundation page as an easter egg, and any component that introduces a second fails the test suite.

Constraint isn't austerity. It's compression. With these rules in place, the agent's decision space collapses from *"which of 47 spacing values?"* to *"which of 9, and why not one of the other 8?"*

### 3. Separate the token layers explicitly

Three files, three jobs:

- **\`primitives.json\`** – raw values only, no meaning (e.g. \`--primitive-color-orange-9\`)
- **\`semantic.json\`** – role aliases that components consume (e.g. \`--color-action-primary\`)
- **Component CSS** – consumes semantic tokens only; *primitives are banned at the component layer*

A build script (\`generate-tokens.mjs\`) validates every reference, flattens the aliases, and emits generated CSS and a typed docs module. The generated files are committed, so drift is catchable in \`git diff\`. The test suite fails the build if any generated file is stale.

The layers are the spine. Everything else bolts onto them.
`

const SOLUTION_INTRO = `
## The solution: design ↔ code parity with AI agents

This is the section that earns the framing. Three execution moves.

### 1. Figma ↔ code parity via Figma MCP

Claude Code has a Figma MCP tool that exposes \`get_design_context\`, \`get_metadata\`, and \`get_screenshot\` against any Figma node. My workflow for any visual change became:

1. Point the agent at a Figma node
2. Ask it to diff the node against the coded component
3. Patch only what's out of sync

**Concrete example.** Midway through the build I updated the Button's Loading state in Figma to use a Remix \`loader-4-line\` icon instead of a CSS border spinner. I told Claude Code to reconcile it. The agent pulled the variant metadata (\`183:182: Size=Large, Variant=Primary, State=Loading\`), saw that the Figma version referenced a \`remix-icons/line/system/loader-4-line\` icon I didn't have in my curated subset, read the SVG from my \`node_modules/remixicon\` folder, added the path data to the \`Icon.tsx\` curated dictionary, and swapped the Button's spinner div for the new \`<Icon>\` component. Type-check passed, build passed, tests passed. The turnaround was seven minutes.

The important thing isn't the speed. It's that **the agent never invented anything** – every move was bound to an explicit rule from \`DESIGN.md\` or the token files. When it ran out of information, it stopped and asked.
`

const SOLUTION_SPEC_PAGES = `
### 2. Every spec page tells the same story

Foundations and components in the docs site are composed from six layout primitives: \`SpecPageLayout\`, \`StateMatrix\`, \`TokenMappingTable\`, \`UsageGuidance\`, \`AccessibilityNotes\`, and \`DoDontExamples\`. Every page uses the same sections in the same order.

This repetition is pedagogy. A reader who spends thirty seconds on the Button page knows how to read every other page in the system. More importantly, the agent knows it too: adding a new component is a fill-in-the-blanks job against a known template, not a bespoke design pass. The structure of the docs is itself a machine-readable contract.
`

const SOLUTION_TRIANGLE = `
### 3. The Figma side has its own contract

\`docs/figma-edit-checklist.md\` is the inverse of \`DESIGN.md\`. When the Figma file needs to change – a new variant, a new state, a token tweak – the checklist forces the editor to declare:

- What primitive and semantic tokens map to the change
- What component contract the change implements
- What the responsive failure mode is
- What the accessibility intent is

The checklist isn't a suggestion. It's the done-criteria for a Figma edit. An edit that can't answer those four questions isn't complete, regardless of how good the pixels look.

Together, \`DESIGN.md\` + \`figma-edit-checklist.md\` + the token JSON files form a triangle. Each side references the other two. An AI agent working on either Figma or code has a stable reference point on every decision.
`

const IMPLEMENTATION = `
## Implementation & results

### Numbers

|  | Before (manual) | With AI agents |
|---|---|---|
| New component time | hours to days | ~20 minutes |
| Figma ↔ code drift | silent and permanent | surfaced by the checklist |
| Token authoring | ad-hoc values in CSS | \`primitives.json\` → generated CSS |
| Accessibility coverage | deferred to audit | enforced in the test suite |
| Docs writing time | hours | minutes (template) |

### Guardrails that caught regressions

Seven test files enforce the contract:

- \`tokens.test.ts\` – token reference validation and generated-file drift
- \`button.test.tsx\`, \`alert.test.tsx\`, \`badge.test.tsx\`, \`tabs.test.tsx\`, \`fields.test.tsx\` – component behavior
- \`docs-routes.test.tsx\` – every route must render state coverage and accessibility guidance

The build runs token generation first and fails on any drift. \`npm run build\` is the contract-enforcement command, not \`npm run test\`. Drift is a build failure, not a test failure, because drift is a build-time fact.

### What shipped

A 12-route spec app. 14 component families. 53 primitive tokens. 92 semantic aliases. 33 curated icons. Zero primitive tokens leaking into component CSS. One markdown contract governing it all. Three weeks, solo, with Claude Code and Codex as the execution layer.

### What still doesn't work

Three honest caveats, because every case study needs them:

- **Variant matrices with ambiguous Figma naming break the agent's diff.** When the Figma file uses \`State=Loading\` in one variant and \`state=loading\` in another, the agent stumbles. I fix this manually. A stricter Figma edit checklist would prevent it.
- **Screenshots of multi-state previews still need human review.** The agent can generate the DOM, but it can't see the rendered pixels without a preview tool, and preview tools are still flakey across repos.
- **\`DESIGN.md\` becomes a bottleneck with more than one human editor.** The file is the contract, so simultaneous edits create merge conflicts on *rules*, not on code. The next version of this system needs a structured format – probably YAML or a typed schema – so that rules can be merged mechanically.

None of these are reasons not to do it. All of them are directions for version two.
`

const REFLECTION = `
## Reflection

Two things I'm taking from this.

**The role shifts from producer to curator.** Solo design-engineering with AI agents isn't *"the agents design and I approve."* It's the opposite: I write the rules, and the agents execute them. The unit of craft stops being the artifact – the Figma frame, the React component, the CSS file – and starts being the contract. A well-written rule in \`DESIGN.md\` is worth more than a pixel-perfect Figma frame, because the rule compounds across every future decision.

**What I'd do differently.**

- Start the accessibility test suite on day one, not day ten. It catches agent regressions the way linting catches human ones.
- Build a visual-diff tool between the Figma library and the coded spec pages from the beginning. Drift is easier to prevent than to clean up.
- Write more quotable rules. Agents execute better against *"one value, no exceptions"* than against *"consider using a single radius value where appropriate."*

Factory is a three-week experiment. The next version is a three-month one, where the markdown contract governs not just tokens and components but product motion, copy, and metrics.
`

// When no next manual project exists, link to the EF global navigation case study.
const NEXT_PROJECT_FALLBACK = {
  slug: 'redesigning-ef-global-navigation',
  title: 'Redesigning EF Global Navigation',
}

// ---------- Component ----------

export default function FactoryCaseStudy() {
  // Sections with content. Flags:
  //  - `cursorFrame: true` renders the static Cursor/DESIGN.md frame above the prose.
  //  - `embed: true` renders a live iframe of the deployed Factory spec app.
  type SimpleSection = {
    kind: 'simple'
    key: string
    cursorFrame?: boolean
    diagram?: 'contract-flow' | 'token-pipeline'
    content: string
  }

  // The solution section interleaves visuals between its three subsections.
  type SolutionSection = { kind: 'solution'; key: 'solution' }

  const contentSections: Array<SimpleSection | SolutionSection> = [
    { kind: 'simple', key: 'overview', diagram: 'contract-flow', content: OVERVIEW },
    { kind: 'simple', key: 'challenge', cursorFrame: true, content: CHALLENGE },
    { kind: 'simple', key: 'process', diagram: 'token-pipeline', content: PROCESS },
    { kind: 'solution', key: 'solution' },
    { kind: 'simple', key: 'implementation', content: IMPLEMENTATION },
    { kind: 'simple', key: 'reflection', content: REFLECTION },
  ]

  const externalLink = (href: string, label: string) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:text-primary-700 underline underline-offset-2"
    >
      {label}
    </a>
  )

  return (
    <article className="pt-36 pb-16">
      {/* Hero text */}
      <div className="container article-column">
        <div>
          <p
            className="text-gray-500 font-medium tracking-widest uppercase mb-6"
            style={{ fontSize: '12px', letterSpacing: '0.12em' }}
          >
            Design System
          </p>

          <h1
            className="text-gray-900 mb-8"
            style={{
              fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
              fontSize: 'clamp(40px, 6vw, 56px)',
              lineHeight: 1.07,
              letterSpacing: '-0.02em',
              fontWeight: 500,
              marginTop: 0,
            }}
          >
            {PROJECT_NAME}
          </h1>

          <p
            className="text-gray-700 mb-12"
            style={{
              fontFamily: "'PP Neue Montreal', ui-sans-serif, system-ui, sans-serif",
              fontSize: 'clamp(18px, 1.6vw, 20px)',
              lineHeight: 1.5,
            }}
          >
            {TAGLINE}
          </p>
        </div>

        {/* Typographic metadata colophon */}
        <div>
          <ArticleMeta
            rows={[
              { label: 'Role', values: [META.role] },
              { label: 'Stack', values: META.stack },
              { label: 'Published', values: [META.date] },
              {
                label: 'Links',
                content: (
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    {externalLink(LINKS.github, 'GitHub')}
                    {externalLink(LINKS.figma, 'Figma')}
                    {externalLink(LINKS.liveDemo, 'Live Demo')}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Content sections: 96px vertical gaps, no divider rules */}
      <div className="container article-column" style={{ marginTop: '96px' }}>
        <div className="space-y-24">
          {contentSections.map((section) => {
            // Custom composition for the solution section: visuals are
            // interleaved between subsections instead of appearing at the top.
            if (section.kind === 'solution') {
              return (
                <section key={section.key}>
                  {/* §1 Figma ↔ code parity */}
                  <div className="article-prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {SOLUTION_INTRO}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-10">
                    <AgentTraceCard />
                  </div>

                  {/* §2 Every spec page tells the same story */}
                  <div className="article-prose mt-10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {SOLUTION_SPEC_PAGES}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-10">
                    <EmbeddedDemo
                      src="/experiments/token-brand-system"
                      displayUrl="nicolasmenard.design/experiments/factory"
                      title="Factory Design System — live spec app"
                      tabs={[
                        { label: 'Overview', path: '/overview' },
                        { label: 'Colors', path: '/foundations/colors' },
                        { label: 'Buttons', path: '/components/buttons' },
                        { label: 'Forms', path: '/components/forms' },
                      ]}
                      caption="Live embed of the Factory spec app. Open full page for the complete navigation."
                    />
                  </div>

                  {/* §3 Contract triangle */}
                  <div className="article-prose mt-10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {SOLUTION_TRIANGLE}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-10">
                    <ContractTriangleDiagram />
                  </div>
                </section>
              )
            }

            return (
              <section key={section.key}>
                {section.cursorFrame && (
                  <div className="mb-10">
                    <CursorDesignMdFrame />
                  </div>
                )}

                {section.diagram === 'contract-flow' && (
                  <div className="mb-10">
                    <ContractFlowDiagram />
                  </div>
                )}

                {section.diagram === 'token-pipeline' && (
                  <div className="mb-10">
                    <TokenPipelineDiagram />
                  </div>
                )}

                <div className="article-prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {section.content}
                  </ReactMarkdown>
                </div>
              </section>
            )
          })}
        </div>

        <div style={{ marginTop: '96px' }}>
          <ArticleFooterNav next={NEXT_PROJECT_FALLBACK} />
        </div>
      </div>

    </article>
  )
}
