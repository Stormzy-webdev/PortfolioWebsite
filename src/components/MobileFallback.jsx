import React, { useState } from 'react'
import { profile } from '../data/profile.js'

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
