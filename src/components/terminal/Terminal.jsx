import React, { useEffect, useRef, useState } from 'react'
import MatrixRain from '../MatrixRain'
import { autocomplete, runCommand } from './commands.js'
import { playClick, playKey } from '../../audio/soundEngine.js'
import { profile } from '../../data/profile.js'

// ===========================================================================
// TERMINAL (keyboard Easter egg)
// A small command line that appears on the left monitor when the visitor
// clicks the keyboard in the room. They type commands (see commands.js) and
// the answers print below, like a real shell:
//   - Enter runs the command, Up/Down scroll through earlier commands,
//     Tab autocompletes, and every key makes a soft typing sound.
//   - `matrix` covers the screen in Matrix rain until a key is pressed.
//   - `exit` swaps the terminal for the normal Portfolio OS menu.
// Escape still leaves the monitors entirely, same as everywhere else.
// ===========================================================================

const PROMPT = 'guest@storm-os:~$'
const MATRIX_SECONDS = 6

const WELCOME = [
  { text: `STORM-OS TERMINAL v2.6  (logged in as guest)`, style: 'accent' },
  { text: `Welcome! This is ${profile.name}'s portfolio, command-line edition.`, style: 'text' },
  { text: "Type 'help' to see what you can do.", style: 'muted' },
]

let nextLineId = 0
const withIds = (lines) => lines.map((line) => ({ ...line, id: nextLineId++ }))

export default function Terminal({ onExit }) {
  const [lines, setLines] = useState(() => withIds(WELCOME))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyPos, setHistoryPos] = useState(-1)
  const [matrixOn, setMatrixOn] = useState(false)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Put the cursor in the prompt straight away. preventScroll matters: these
  // screens are 3D-positioned, and letting the browser scroll to the input
  // would shift the whole monitor UI out of place.
  const focusInput = () => inputRef.current?.focus({ preventScroll: true })
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  // Keep the newest output in view (scrolls only this box, never the page).
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  // The `matrix` effect switches itself off after a few seconds.
  useEffect(() => {
    if (!matrixOn) return
    const timer = setTimeout(() => setMatrixOn(false), MATRIX_SECONDS * 1000)
    return () => clearTimeout(timer)
  }, [matrixOn])

  const submit = () => {
    const { lines: output, action } = runCommand(input)
    const echo = { text: input, style: 'command' }

    if (input.trim()) setHistory((previous) => [...previous, input])
    setHistoryPos(-1)
    setInput('')
    playClick()

    if (action === 'clear') {
      setLines([])
      return
    }

    setLines((previous) => [...previous, ...withIds([echo, ...output])])

    if (action === 'matrix') setMatrixOn(true)
    if (action === 'email') window.location.href = `mailto:${profile.email}`
    if (action === 'cv') window.open(profile.cv, '_blank', 'noopener')
    if (action === 'exit') setTimeout(() => onExit?.(), 450)
  }

  const handleKeyDown = (event) => {
    if (matrixOn) {
      setMatrixOn(false)
      event.preventDefault()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      submit()
      return
    }

    // Up/Down: walk back and forward through previously run commands.
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!history.length) return
      const goingBack = event.key === 'ArrowUp'
      const start = historyPos === -1 ? history.length : historyPos
      const next = goingBack ? Math.max(0, start - 1) : start + 1
      if (next >= history.length) {
        setHistoryPos(-1)
        setInput('')
      } else {
        setHistoryPos(next)
        setInput(history[next])
      }
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const completed = autocomplete(input)
      if (completed) setInput(`${completed} `)
      return
    }

    if (event.key.length === 1 || event.key === 'Backspace') playKey()
  }

  return (
    <div className="terminal" onClick={focusInput}>
      <div className="terminal__output" ref={outputRef}>
        {lines.map((line) =>
          line.style === 'command' ? (
            <p key={line.id} className="terminal__line terminal__line--command">
              <span className="terminal__prompt">{PROMPT}</span> {line.text}
            </p>
          ) : line.href ? (
            <p key={line.id} className="terminal__line terminal__line--link">
              {/* Everything except email opens in a new tab so the portfolio stays open */}
              <a href={line.href} target={line.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                {line.text}
              </a>
            </p>
          ) : (
            <p key={line.id} className={`terminal__line terminal__line--${line.style}`}>
              {line.text || ' '}
            </p>
          )
        )}

        <label className="terminal__input-row">
          <span className="terminal__prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
          />
        </label>
      </div>

      {matrixOn && (
        <div className="terminal__matrix" onClick={() => setMatrixOn(false)}>
          <MatrixRain />
        </div>
      )}
    </div>
  )
}
