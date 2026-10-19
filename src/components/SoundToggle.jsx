import React from 'react'

// ---------------------------------------------------------------------------
// SOUND TOGGLE
// Top-right button that mutes / unmutes every sound on the site. The choice
// is remembered between visits (see setMuted in audio/soundEngine.js).
// ---------------------------------------------------------------------------
export default function SoundToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      className={`hud-button sound-toggle ${muted ? 'is-muted' : ''}`}
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
    >
      <svg className="sound-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="square" />
        ) : (
          <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" />
        )}
      </svg>
      <span className="sound-toggle__label">{muted ? 'Sound off' : 'Sound on'}</span>
    </button>
  )
}
