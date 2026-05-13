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
      <div className="right-screen-ui__left">
        <p className="right-screen-ui__kicker">Project Terminal</p>
        <h4 className="right-screen-ui__title">{title}</h4>
        <p className="right-screen-ui__subtitle">{subtitle}</p>
        <p className="right-screen-ui__desc">{description}</p>

        <div className="right-screen-ui__tech-head">
          <span>Tech Stack</span>
          <span className="right-screen-ui__status">{isIdle ? 'Standby' : 'Live'}</span>
        </div>

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

      <div className="right-screen-ui__right">
        <div className="right-screen-ui__viewport">
          <div className="right-screen-ui__viewport-glow" />
          <p className="right-screen-ui__viewport-label">Live Preview Window</p>
        </div>
      </div>
    </section>
  )
}
