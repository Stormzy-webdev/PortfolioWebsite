import React from 'react'

export default function ProjectInfoOverlay({ project, isIdle = false }) {
  const title = project?.title || 'Project Preview'
  const description =
    project?.description ||
    'Select a project from the left monitor to load a focused preview on the showcase display.'
  const tech = Array.isArray(project?.tech) ? project.tech : []
  const links = project?.links || {}
  const hasPreview = Boolean(project?.previewVideo || project?.previewImage)

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
        <div className="right-screen-ui__footer-main">
          <div className="right-screen-ui__footer-info">
            <h4 className="right-screen-ui__footer-title">{title}</h4>
            <p className="right-screen-ui__footer-desc">{description}</p>
          </div>

          <div className="right-screen-ui__viewport" aria-label="Project preview">
            <div className="right-screen-ui__viewport-glow" aria-hidden="true" />
            <div className="right-screen-ui__viewport-frame" aria-hidden="true" />
            {/* Until a screen recording is added in projects.js, say so instead of showing an empty box */}
            {!isIdle && !hasPreview && (
              <p className="right-screen-ui__viewport-empty">
                <span className="right-screen-ui__viewport-empty-icon" aria-hidden="true">&#9654;</span>
                Preview recording coming soon
              </p>
            )}
          </div>
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

          {/* ---------------------------------------------------------------
              PROJECT LINKS: "View code" (GitHub) and "Live demo" buttons, or
              a short note (e.g. client work) when there's nothing public.
              Set these per project in data/projects.js.
              --------------------------------------------------------------- */}
          {!isIdle && (links.code || links.live || project?.note) && (
            <div className="right-screen-ui__links">
              {links.live && (
                <a className="right-screen-ui__link right-screen-ui__link--primary" href={links.live} target="_blank" rel="noreferrer">
                  Live demo
                </a>
              )}
              {links.code && (
                <a className="right-screen-ui__link" href={links.code} target="_blank" rel="noreferrer">
                  View code
                </a>
              )}
              {!links.code && !links.live && project?.note && (
                <p className="right-screen-ui__note">{project.note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
