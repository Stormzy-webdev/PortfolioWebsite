import React, { useMemo, useRef, useState } from 'react'
import { playClick } from '../audio/soundEngine.js'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import { profile } from '../data/profile.js'
import { about, education, experience, skills } from '../data/content.js'

// Contact line built from data/profile.js (the same details the terminal and
// the phone screen use), so contact info only ever needs updating in one place.
const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const contactBody = [
  profile.email && `Email: ${profile.email}`,
  profile.github && `GitHub: ${stripProtocol(profile.github)}`,
  profile.linkedin && `LinkedIn: ${stripProtocol(profile.linkedin)}`,
]
  .filter(Boolean)
  .join('  |  ')

// The text for each tab comes from data/content.js (About, Skills, Experience),
// data/projects.js and data/profile.js (Contact).

// These screens are scaled down in 3D, so a normal mouse-wheel step would
// scroll far too far. Scroll a small, steady amount instead.
const WHEEL_SPEED = 0.08
function scrollGently(event, container) {
  if (!container) return
  event.preventDefault()
  event.stopPropagation()
  container.scrollTop += event.deltaY * WHEEL_SPEED
}

// The content of the About / Skills / Experience / Contact tabs.
function TabBody({ tab }) {
  if (tab === 'about') {
    return (
      <>
        <AvailabilityBadge className="availability-badge--monitor" />
        {about.map((paragraph) => (
          <p className="monitor-copy monitor-copy--para" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </>
    )
  }

  if (tab === 'skills') {
    return skills.map(({ group, items }) => (
      <div className="monitor-skill-group" key={group}>
        <p className="monitor-skill-group__label">{group}</p>
        <div className="monitor-skill-group__items">
          {items.map((item) => (
            <span className="monitor-skill-tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    ))
  }

  if (tab === 'experience') {
    return (
      <>
        {experience.map((job) => (
          <div className="monitor-job" key={job.role + job.dates}>
            <p className="monitor-job__head">
              <span className="monitor-job__role">{job.role}</span>
              <span className="monitor-job__dates">{job.dates}</span>
            </p>
            <p className="monitor-job__place">{job.place}</p>
            <ul className="monitor-job__points">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className="monitor-skill-group__label">Education</p>
        {education.map((entry) => (
          <p className="monitor-copy monitor-copy--small" key={entry.title}>
            <strong>{entry.title}</strong> · {entry.place} ({entry.dates})
          </p>
        ))}
      </>
    )
  }

  // Contact
  return (
    <>
      <p className="monitor-copy">{contactBody}</p>
      {profile.cv && (
        <a className="monitor-cv-link" href={profile.cv} target="_blank" rel="noreferrer">
          Download CV (PDF)
        </a>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// PROJECT LIST (Projects tab)
// A compact, scannable list instead of big blocks, so most projects are
// visible at once:
//   - Filter pills (All + one per category from projects.js) narrow the list.
//   - One slim row per project: number, title, a green ▶ when there's a screen
//     recording, and two tech hints. Full details show on the right monitor.
//   - Hovering, clicking, Tab or the ↑/↓ arrow keys select a project.
// ---------------------------------------------------------------------------
const ALL = 'All'

function ProjectList({ projects, selectedProjectId, onProjectHover, onProjectSelect }) {
  const [filter, setFilter] = useState(ALL)
  const listRef = useRef(null)

  // Categories in the order they first appear in projects.js
  const categories = useMemo(() => [...new Set(projects.map((p) => p.category || 'Other'))], [projects])
  const visible = filter === ALL ? projects : projects.filter((p) => (p.category || 'Other') === filter)

  const chooseFilter = (next) => {
    if (next === filter) return
    playClick()
    setFilter(next)
    // Keep the right monitor in step: if the shown project is filtered out,
    // show the first one in the new list instead.
    const nextVisible = next === ALL ? projects : projects.filter((p) => (p.category || 'Other') === next)
    if (nextVisible.length && !nextVisible.some((p) => p.id === selectedProjectId)) onProjectHover?.(nextVisible[0].id)
    if (listRef.current) listRef.current.scrollTop = 0
  }

  // ↑/↓ move to the previous/next row. Scrolls only this list (never the
  // page: these screens are 3D-positioned, so browser scrolling would shift them).
  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const rows = [...listRef.current.querySelectorAll('.plist-row')]
    const current = rows.indexOf(document.activeElement)
    const next = rows[Math.min(rows.length - 1, Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1)))]
    if (!next) return
    event.preventDefault()
    next.focus({ preventScroll: true })
    const list = listRef.current
    if (next.offsetTop < list.scrollTop) list.scrollTop = next.offsetTop
    else if (next.offsetTop + next.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = next.offsetTop + next.offsetHeight - list.clientHeight
    }
  }

  return (
    <div className="monitor-projects-wrap">
      <div className="plist-filters" role="group" aria-label="Filter projects by category">
        {[ALL, ...categories].map((name) => (
          <button
            key={name}
            type="button"
            className={`plist-filter ${filter === name ? 'is-active' : ''}`}
            aria-pressed={filter === name}
            onClick={() => chooseFilter(name)}
          >
            {name}
            {name === ALL && <span className="plist-filter__count">{projects.length}</span>}
          </button>
        ))}
      </div>

      <div
        ref={listRef}
        className="monitor-projects"
        aria-label="Projects"
        onWheel={(event) => scrollGently(event, listRef.current)}
        onKeyDown={handleKeyDown}
      >
        {visible.map((project) => (
          <button
            key={project.id}
            type="button"
            className={`plist-row ${selectedProjectId === project.id ? 'is-selected' : ''}`}
            aria-current={selectedProjectId === project.id ? 'true' : undefined}
            onMouseEnter={() => onProjectHover?.(project.id)}
            onFocus={() => onProjectHover?.(project.id)}
            onClick={() => onProjectSelect?.(project.id)}
          >
            {/* number stays the same whichever filter is active */}
            <span className="plist-row__index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
            <span className="plist-row__title">
              {project.title}
              {project.previewVideo && (
                <span className="plist-row__video" title="Has a screen recording" aria-label="has a screen recording">
                  &#9654;
                </span>
              )}
            </span>
            <span className="plist-row__tech">{(project.tech || []).slice(0, 2).join(' · ')}</span>
          </button>
        ))}
        {visible.length === 0 && <p className="plist-empty">No projects in this category yet.</p>}
      </div>
    </div>
  )
}

// The open tab is owned by PortfolioScene (passed in as activeTab) rather than
// remembered here, so the camera, the right monitor and this screen always
// agree, and Exit can reset everything back to About.
export default function MonitorUI({
  visible = false,
  activeTab = 'about',
  onTabChange,
  onOpenTerminal,
  onProjectHover,
  onProjectSelect,
  projects = [],
  selectedProjectId,
}) {
  const cardScrollRef = useRef(null)

  const handleTabChange = (tab) => {
    onTabChange?.(tab)
  }

  return (
    <div className={`monitor-ui-panel ${visible ? 'monitor-ui-visible' : ''}`}>
      <header className="monitor-brand">
        <p className="monitor-brand__kicker">Portfolio OS</p>
        <h2 className="monitor-brand__name">Storm Ismail</h2>
      </header>

      {/* Second way into the keyboard Easter egg, for visitors who used Start */}
      <button
        type="button"
        className="monitor-terminal-launch"
        onClick={() => onOpenTerminal?.()}
        aria-label="Open the terminal"
      >
        &gt;_ terminal
      </button>

      <div className="monitor-tabs">
        <button
          className={`monitor-tab ${activeTab === 'about' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('about')}
        >
          About
        </button>
        <button
          className={`monitor-tab ${activeTab === 'projects' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('projects')}
        >
          Projects
        </button>
        <button
          className={`monitor-tab ${activeTab === 'skills' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('skills')}
        >
          Skills
        </button>
        <button
          className={`monitor-tab ${activeTab === 'experience' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('experience')}
        >
          Experience
        </button>
        <button
          className={`monitor-tab ${activeTab === 'contact' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('contact')}
        >
          Contact
        </button>
      </div>

      <section className="monitor-content">
        {/* No big section heading here: the highlighted tab already says where you are */}
        {activeTab === 'projects' ? (
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectHover={onProjectHover}
            onProjectSelect={onProjectSelect}
          />
        ) : (
          <article
            className="monitor-card"
            ref={cardScrollRef}
            onWheel={(event) => scrollGently(event, cardScrollRef.current)}
          >
            <TabBody tab={activeTab} />
          </article>
        )}
      </section>
    </div>
  )
}
