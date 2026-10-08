import React, { useState } from 'react'
import { useProgress } from '@react-three/drei'

const SEGMENTS = 24

const BOOT_LINES = [
  { at: 0, text: 'init render core' },
  { at: 20, text: 'loading environment' },
  { at: 45, text: 'mounting workstation' },
  { at: 75, text: 'calibrating displays' },
]

function fileName(url) {
  if (!url) return ''
  return decodeURIComponent(url.split('?')[0].split('/').pop())
}

export default function LoadingScreen({ ready = false }) {
  const { progress, item } = useProgress()
  const [gone, setGone] = useState(false)

  // Loader progress can briefly hit 100 between files, so only the scene
  // actually mounting (ready) is allowed to report completion.
  const percent = ready ? 100 : Math.min(99, Math.floor(progress))
  const filled = Math.round((percent / 100) * SEGMENTS)
  const lines = BOOT_LINES.filter((line) => percent >= line.at)

  if (gone) return null

  return (
    <div
      className={`loading-screen ${ready ? 'is-done' : ''}`}
      onTransitionEnd={(event) => {
        if (ready && event.target === event.currentTarget) setGone(true)
      }}
      role="status"
      aria-live="polite"
      aria-label={ready ? 'Scene loaded' : `Loading scene, ${percent} percent`}
    >
      <div className="loading-panel">
        <p className="loading-panel__kicker">Portfolio OS</p>
        <h1 className="loading-panel__title" data-text="System Boot">
          System Boot
        </h1>

        <ul className="loading-log" aria-hidden="true">
          {lines.map((line) => (
            <li key={line.text}>
              <span className="loading-log__prompt">&gt;</span> {line.text}
              <span className="loading-log__ok">ok</span>
            </li>
          ))}
          {ready ? (
            <li className="loading-log__ready">
              <span className="loading-log__prompt">&gt;</span> system ready
            </li>
          ) : (
            <li className="loading-log__current">
              <span className="loading-log__prompt">&gt;</span> {fileName(item) || 'fetching assets'}
              <span className="loading-log__cursor" />
            </li>
          )}
        </ul>

        <div className="loading-bar" aria-hidden="true">
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`loading-bar__seg ${i < filled ? 'is-on' : ''}`} />
          ))}
        </div>
        <p className="loading-panel__percent">{percent.toString().padStart(3, '0')}%</p>
      </div>
    </div>
  )
}
