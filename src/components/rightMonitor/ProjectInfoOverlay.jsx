import React from 'react'

// ===========================================================================
// RIGHT MONITOR: PROJECT SHOWCASE
// What the right monitor shows for the project hovered/clicked on the left.
// The layout is built around the screen recording, which gets as much room as
// possible:
//
//   ┌ PROJECT TERMINAL  [Live demo][View code] ┐  slim bar + buttons
//   │ TITLE · subtitle                         │  compact info bar
//   │ two-line description                     │  (always the same height)
//   │ ┌ recording ───────────────────────────┐ │  fills the rest of the
//   │ │                                      │ │  screen, full width
//   │ └──────────────────────────────────────┘ │
//   │ React · Node.js · Express · MongoDB ...  │  tech stack in one row
//   └──────────────────────────────────────────┘
//
// The buttons live in the top bar so the info bar is the same height for
// every project, which keeps the recording the same size whether a project
// has one link, two or none.
//
// Everything comes from data/projects.js. Styles: .rsu* in App.css.
// ===========================================================================

export default function ProjectInfoOverlay({ project, isIdle = false }) {
  const title = project?.title || 'Project Preview'
  const description =
    project?.description ||
    'Select a project from the left monitor to load a focused preview on the showcase display.'
  const tech = Array.isArray(project?.tech) ? project.tech : []
  const links = project?.links || {}
  const hasPreview = Boolean(project?.previewVideo || project?.previewImage)
  const showLinks = !isIdle && (links.code || links.live || project?.note)

  return (
    <section className="right-screen-ui rsu" aria-label="Right screen project showcase">
      <div className="right-screen-ui__header-bar rsu__bar">
        <span className="right-screen-ui__window-dot" aria-hidden="true" />
        <span className="right-screen-ui__window-title">Project Terminal</span>

        {/* Live demo / View code buttons (or a short note, e.g. client work) */}
        {showLinks && (
          <div className="rsu__links">
            {!links.code && !links.live && project?.note && <span className="rsu__note">{project.note}</span>}
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
          </div>
        )}
      </div>

      {/* Title and short description */}
      <div className="rsu__info">
        <div className="rsu__text">
          <h4 className="rsu__title">
            {title}
            {project?.subtitle && <span className="rsu__subtitle"> · {project.subtitle}</span>}
          </h4>
          <p className="rsu__desc">{description}</p>
        </div>

      </div>

      {/* -------------------------------------------------------------------
          SCREEN RECORDING: the selected project's clip plays here, silent and
          looping. The poster (thumbnail) shows instantly while it loads, and
          `key` makes it swap cleanly when the project changes.
          ------------------------------------------------------------------- */}
      <div className="right-screen-ui__viewport rsu__viewport" aria-label="Project preview">
        <div className="right-screen-ui__viewport-glow" aria-hidden="true" />
        {!isIdle && project?.previewVideo ? (
          <video
            key={project.id}
            className="right-screen-ui__video"
            src={project.previewVideo}
            poster={project.previewImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={`Screen recording of ${title}`}
          />
        ) : !isIdle && project?.previewImage ? (
          <img key={project.id} className="right-screen-ui__video" src={project.previewImage} alt={`Screenshot of ${title}`} />
        ) : null}
        <div className="right-screen-ui__viewport-frame" aria-hidden="true" />

        {/* Until a screen recording is added in projects.js, say so instead of showing an empty box */}
        {!isIdle && !hasPreview && (
          <p className="right-screen-ui__viewport-empty">
            <span className="right-screen-ui__viewport-empty-icon" aria-hidden="true">&#9654;</span>
            Preview recording coming soon
          </p>
        )}
      </div>

      {/* Tech stack as one slim row of chips */}
      <div className="rsu__tech" aria-label="Tech stack">
        {tech.length > 0 ? (
          tech.slice(0, 6).map((item) => (
            <span className="right-screen-ui__chip rsu__chip" key={item}>
              {item}
            </span>
          ))
        ) : (
          <span className="right-screen-ui__chip rsu__chip">{isIdle ? 'Awaiting Selection' : 'Preview Ready'}</span>
        )}
      </div>
    </section>
  )
}
