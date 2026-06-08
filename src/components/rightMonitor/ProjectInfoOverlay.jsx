import React from 'react'

export default function ProjectInfoOverlay({ project, isIdle = false }) {
  const title = project?.title || 'Project Preview'
  const subtitle = project?.subtitle || 'Showcase Window'
  const description =
    project?.description ||
    'Select a project from the left monitor to load a focused preview on the showcase display.'
  const tech = Array.isArray(project?.tech) ? project.tech : []

  return (
    <section className="right-screen-ui" aria-label="Right screen project dashboard">
      <div className="right-screen-ui__header">
        <div className="right-screen-ui__header-bar">
          <span className="right-screen-ui__window-dot" aria-hidden="true" />
          <span className="right-screen-ui__window-title">Project Terminal</span>
          <span className="right-screen-ui__window-meta">{isIdle ? 'Standby' : 'Live'}</span>
        </div>
        <p className="right-screen-ui__header-note">Hovered project details and tech stack</p>
      </div>

      <div className="right-screen-ui__body">
        <div className="right-screen-ui__details">
          <p className="right-screen-ui__section-label">Project Details</p>
          <h4 className="right-screen-ui__title">{title}</h4>
          <p className="right-screen-ui__subtitle">{subtitle}</p>
          <p className="right-screen-ui__desc">{description}</p>
        </div>

        <div className="right-screen-ui__tech-pane">
          <div className="right-screen-ui__tech-heading-block">
            <p className="right-screen-ui__section-label">Tech Stack</p>
          </div>

          <div className="right-screen-ui__tech-chips-block">
            <div className="right-screen-ui__tech">
              {tech.length > 0 ? (
                tech.slice(0, 6).map((item) => (
                  <span className="right-screen-ui__chip" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <span className="right-screen-ui__chip">{isIdle ? 'Awaiting Selection' : 'Preview Ready'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
