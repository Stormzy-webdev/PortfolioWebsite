import React, { useMemo } from 'react'

// ---------------------------------------------------------------------------
// MATRIX RAIN
// Columns of green characters falling down a monitor screen. Used as the
// left monitor's idle screen and by the terminal's `matrix` command.
// The falling motion is CSS (.matrix-idle / .matrix-column in App.css); each
// column gets its own speed and start delay so they don't move in lockstep.
// ---------------------------------------------------------------------------
const MATRIX_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>'
const MATRIX_COLUMN_COUNT = 18

export default function MatrixRain() {
  const columns = useMemo(() => {
    return Array.from({ length: MATRIX_COLUMN_COUNT }, (_, i) => {
      let text = ''
      for (let j = 0; j < 28; j += 1) {
        text += MATRIX_CHARS[(i * 7 + j * 11) % MATRIX_CHARS.length]
      }
      return { text, delay: (i % 6) * -0.6, duration: 3.2 + (i % 5) * 0.45 }
    })
  }, [])

  return (
    <div className="matrix-idle" aria-hidden="true">
      {columns.map((column, index) => (
        <span
          key={index}
          className="matrix-column"
          style={{ '--delay': `${column.delay}s`, '--duration': `${column.duration}s` }}
        >
          {column.text}
        </span>
      ))}
    </div>
  )
}
