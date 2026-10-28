import React, { useState } from 'react'
import { profile } from '../data/profile.js'
import { projects } from '../data/projects.js'
import AvailabilityBadge from './AvailabilityBadge.jsx'

// ===========================================================================
// 2D PORTFOLIO (phone version + desktop "quick view")
// The whole portfolio as a simple scrolling page, with no 3D:
//   variant="phone"   phones get this instead of the 3D scene, with a
//                     "best experienced on desktop" note and a share button
//   variant="desktop" the "Quick view" for recruiters in a hurry or on slow
//                     laptops (opened from the landing screen or with
//                     ?view=quick in the address), with a link back to the 3D
// Same data as the monitors: data/profile.js and data/projects.js.
// ===========================================================================
export default function MobileFallback({ variant = 'phone' }) {
  const isDesktop = variant === 'desktop'
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
    <main className={`mobile-fallback ${isDesktop ? 'mobile-fallback--desktop' : ''}`}>
      <div className="mobile-fallback__inner">
        <p className="mobile-fallback__kicker">Portfolio OS</p>
        <h1 className="mobile-fallback__name" data-text={profile.name}>
          {profile.name}
        </h1>
        <p className="mobile-fallback__role">{profile.role}</p>
        <AvailabilityBadge className="availability-badge--page" />

        <p className="mobile-fallback__intro">{profile.intro}</p>

        {isDesktop ? (
          <section className="mobile-fallback__notice" aria-label="Quick view">
            <p className="mobile-fallback__notice-line">
              <span className="mobile-fallback__prompt">&gt;</span> quick view: everything, without the 3D
              <span className="mobile-fallback__cursor" aria-hidden="true" />
            </p>
            <a className="mobile-fallback__share" href="/">
              Open the 3D portfolio
            </a>
          </section>
        ) : (
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
        )}

        {/* -----------------------------------------------------------------
            PROJECTS: so a recruiter on their phone still sees the work, not
            just contact details. Same data as the monitors (data/projects.js).
            ----------------------------------------------------------------- */}
        <section className="mobile-fallback__projects" aria-label="Projects">
          <h2 className="mobile-fallback__section-title">Projects</h2>
          {projects.map((project) => (
            <article className="mobile-project" key={project.id}>
              {/* Thumbnail only (light on data); tapping it opens the recording
                  in the phone's own video player */}
              {project.previewImage && (
                <a
                  className="mobile-project__media"
                  href={project.previewVideo || project.previewImage}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={project.previewVideo ? `Watch the ${project.title} recording` : `View ${project.title} screenshot`}
                >
                  <img src={project.previewImage} alt="" loading="lazy" />
                  {project.previewVideo && <span className="mobile-project__play">&#9654; Watch demo</span>}
                </a>
              )}
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
