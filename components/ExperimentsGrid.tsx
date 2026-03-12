'use client'

import { useEffect, useState } from 'react'
import ExperimentCard, { Experiment } from './ExperimentCard'

export default function ExperimentsGrid({ experiments }: { experiments: Experiment[] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Experiments">
      {experiments.map((experiment, i) => (
        <div
          key={experiment.slug}
          role="listitem"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            transitionDelay: `${i * 120}ms`,
          }}
        >
          <ExperimentCard experiment={experiment} />
        </div>
      ))}
    </div>
  )
}
