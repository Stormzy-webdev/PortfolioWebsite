import React from 'react'

// ---------------------------------------------------------------------------
// BIOS BOOT SEQUENCE
// Shown on the left monitor while it "powers on", between the Matrix idle
// screen and the Portfolio OS menu. Each line types itself out one after the
// other (pure CSS: see .boot-sequence in App.css), like an old PC booting.
//
// To change the text, edit BOOT_LINES. Keep the total time shorter than
// MONITOR_BOOT_MS in PortfolioScene.jsx, or the menu will cut the last lines off.
// ---------------------------------------------------------------------------

// `status` is printed on the right-hand side of the line (leave it out for none)
const BOOT_LINES = [
  { text: 'PORTFOLIO OS BIOS v2.6' },
  { text: 'CPU: CREATIVE CORE @ 4.20GHz', status: 'OK' },
  { text: 'MEMORY TEST: 32768K', status: 'OK' },
  { text: 'LOADING PROFILE: STORM_ISMAIL', status: 'OK' },
  { text: 'MOUNTING /PROJECTS', status: 'OK' },
  { text: '> STARTING DESKTOP' },
]

// When the first line starts typing, and the gap before each next line (ms).
// The first part of the boot is the screen flickering on, so wait for that.
const FIRST_LINE_AT = 500
const LINE_GAP = 230

export default function BootSequence() {
  return (
    <div className="boot-sequence" aria-hidden="true">
      {BOOT_LINES.map((line, index) => (
        <p
          key={line.text}
          className="boot-sequence__line"
          style={{ '--delay': `${FIRST_LINE_AT + index * LINE_GAP}ms` }}
        >
          <span className="boot-sequence__text">{line.text}</span>
          {line.status && <span className="boot-sequence__status">{line.status}</span>}
        </p>
      ))}
      <span
        className="boot-sequence__cursor"
        style={{ '--delay': `${FIRST_LINE_AT + BOOT_LINES.length * LINE_GAP}ms` }}
      />
    </div>
  )
}
