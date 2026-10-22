import React, { useState } from 'react'
import { profile } from '../data/profile.js'
import { projects } from '../data/projects.js'

export default function MobileFallback() {
  const [shareStatus, setShareStatus] = useState('')

  const links = [
    profile.email && { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.github && { label: 'GitHub', value: profile.github.replace(/^https?:\/\//, ''), href: profile.github },
    profile.linkedin && { label: 'LinkedIn', value: profile.linkedin.replace(/^https?:\/\//, ''), href: profile.linkedin },
    profile.cv && { label: 'CV', value: 'Download PDF', href: profile.cv },
  ].filter(Boolean)

  const handleSendLink = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.name} — Portfolio`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareStatus('Link copied')
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to report.
    }
  }

  return (
    <main className="mobile-fallback">
      <div className="mobile-fallback__inner">
        <p className="mobile-fallback__kicker">Portfolio OS</p>
        <h1 className="mobile-fallback__name" data-text={profile.name}>
          {profile.name}
        </h1>
        <p className="mobile-fallback__role">{profile.role}</p>

        <p className="mobile-fallback__intro">{profile.intro}</p>

        <section className="mobile-fallback__notice" aria-label="Desktop experience">
          <p className="mobile-fallback__notice-line">
            <span className="mobile-fallback__prompt">&gt;</span> 3D workstation detected
          </p>
          <p className="mobile-fallback__notice-line">
            <span className="mobile-fallback__prompt">&gt;</span> best experienced on desktop
            <span className="mobile-fallback__cursor" aria-hidden="true" />
          </p>
          <button type="button" className="mobile-fallback__share" onClick={handleSendLink}>
            Send this link to myself
          </button>
          {shareStatus && (
            <p className="mobile-fallback__share-status" role="status">
              {shareStatus}
            </p>
          )}
        </section>

        {/* -----------------------------------------------------------------
            PROJECTS: so a recruiter on their phone still sees the work, not
            just contact details. Same data as the monitors (data/projects.js).
            ----------------------------------------------------------------- */}
        <section className="mobile-fallback__projects" aria-label="Projects">
          <h2 className="mobile-fallback__section-title">Projects</h2>
          {projects.map((project) => (
            <article className="mobile-project" key={project.id}>
              <h3 className="mobile-project__title">{project.title}</h3>
              <p className="mobile-project__subtitle">{project.subtitle}</p>
              <p className="mobile-project__desc">{project.description}</p>
              <p className="mobile-project__tech">{project.tech.join(' · ')}</p>
              {project.links?.code || project.links?.live ? (
                <p className="mobile-project__links">
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" rel="noreferrer">
                      Live demo
                    </a>
                  )}
                  {project.links.code && (
                    <a href={project.links.code} target="_blank" rel="noreferrer">
                      View code
                    </a>
                  )}
                </p>
              ) : (
                project.note && <p className="mobile-project__note">{project.note}</p>
              )}
            </article>
          ))}
        </section>

        <h2 className="mobile-fallback__section-title">Contact</h2>
        <ul className="mobile-fallback__links">
          {links.map((link) => (
            <li key={link.label}>
              {/* Everything except email opens in a new tab so the portfolio stays open */}
              <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                <span className="mobile-fallback__link-label">{link.label}</span>
                <span className="mobile-fallback__link-value">{link.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
