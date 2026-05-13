import React from 'react'

export default function ProjectInfoOverlay({ project, visible = false }) {
  if (!project) return null

  return (
    <div className={`right-monitor-meta ${visible ? 'is-visible' : ''}`}>
      <p className="right-monitor-meta__subtitle">{project.subtitle || 'Interactive Showcase'}</p>
      <h4 className="right-monitor-meta__title">{project.title}</h4>
      {project.description ? <p className="right-monitor-meta__desc">{project.description}</p> : null}
      {project.technologies?.length ? (
        <div className="right-monitor-meta__tech">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
