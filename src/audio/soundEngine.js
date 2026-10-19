// ===========================================================================
// SOUND ENGINE
// Every sound on the site is generated live with the browser's Web Audio API
// (oscillators + filtered noise) instead of audio files, so there is nothing
// extra to download and the sounds can't fail to load.
//
// How it fits together:
//   - Browsers only allow sound after the visitor clicks something, so
//     unlockAudio() must be called from a click (the Start button does this).
//   - Everything plays through one "master" volume knob. Muting just turns
//     that knob to zero, and the choice is remembered between visits.
//   - startAmbience() starts the background room/PC hum, which loops quietly.
//   - playBoot(), playClick() and playPowerDown() are short one-off effects.
//
// To make the whole site louder or quieter, change MASTER_VOLUME.
// ===========================================================================

const MASTER_VOLUME = 0.5
const MUTE_STORAGE_KEY = 'portfolio-sound-muted'

let ctx = null
let master = null
let ambienceStarted = false
let muted = readStoredMute()

function readStoredMute() {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

// Creates the audio system the first time it's needed (must be inside a click).
function ensureContext() {
  if (ctx) {
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume()
    return ctx
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null

  ctx = new AudioContextClass()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : MASTER_VOLUME
  master.connect(ctx.destination)

  // Go quiet while the visitor is on another browser tab.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  })

  return ctx
}

export function unlockAudio() {
  ensureContext()
}

export function isMuted() {
  return muted
}

export function setMuted(next) {
  muted = next
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, next ? '1' : '0')
  } catch {
    // Storage blocked (private mode etc.): the toggle still works for this visit.
  }
  if (!ctx) return
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setTargetAtTime(next ? 0 : MASTER_VOLUME, ctx.currentTime, 0.08)
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

// A gain (volume) node that jumps to `peak` at `start` and fades out over `length`.
function envelope(start, peak, length) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
  gain.connect(master)
  return gain
}

// A tone that slides from one pitch to another (e.g. the CRT "thunk").
function sweep({ type = 'sine', from, to, start, length, volume }) {
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, start)
  osc.frequency.exponentialRampToValueAtTime(to, start + length)
  osc.connect(envelope(start, volume, length))
  osc.start(start)
  osc.stop(start + length + 0.05)
}

let whiteNoise = null
function noiseBuffer() {
  if (whiteNoise) return whiteNoise
  const length = ctx.sampleRate * 2
  whiteNoise = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = whiteNoise.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return whiteNoise
}

// A short burst of filtered static (clicks, the crackle of a screen turning on).
function noiseBurst({ start, length, volume, filter = 'bandpass', frequency = 2000 }) {
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer()
  const shaper = ctx.createBiquadFilter()
  shaper.type = filter
  shaper.frequency.value = frequency
  source.connect(shaper)
  shaper.connect(envelope(start, volume, length))
  source.start(start)
  source.stop(start + length + 0.05)
}

// ---------------------------------------------------------------------------
// The sounds
// ---------------------------------------------------------------------------

// Background room tone: a soft PC fan rumble plus a faint electrical hum.
// Fades in over a few seconds and loops forever (until muted / tab hidden).
export function startAmbience() {
  if (ambienceStarted || !ensureContext()) return
  ambienceStarted = true
  const now = ctx.currentTime

  const bed = ctx.createGain()
  bed.gain.setValueAtTime(0.0001, now)
  bed.gain.exponentialRampToValueAtTime(1, now + 3)
  bed.connect(master)

  // Fan rumble: "brown" noise (white noise smoothed out) through a low filter.
  const length = ctx.sampleRate * 4
  const rumble = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = rumble.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  const fan = ctx.createBufferSource()
  fan.buffer = rumble
  fan.loop = true
  const fanFilter = ctx.createBiquadFilter()
  fanFilter.type = 'lowpass'
  fanFilter.frequency.value = 320
  const fanVolume = ctx.createGain()
  fanVolume.gain.value = 0.09
  fan.connect(fanFilter).connect(fanVolume).connect(bed)
  fan.start(now)

  // Electrical hum: two very quiet low tones.
  for (const [frequency, volume] of [[50, 0.012], [100, 0.006]]) {
    const hum = ctx.createOscillator()
    hum.frequency.value = frequency
    const humVolume = ctx.createGain()
    humVolume.gain.value = volume
    hum.connect(humVolume).connect(bed)
    hum.start(now)
  }
}

// Monitors powering on: a CRT "thunk", a burst of static, a charging whine
// and the classic single BIOS "everything's OK" beep.
export function playBoot() {
  if (!ensureContext()) return
  const now = ctx.currentTime
  sweep({ from: 95, to: 38, start: now, length: 0.35, volume: 0.45 })
  noiseBurst({ start: now, length: 0.22, volume: 0.12, frequency: 2600 })
  sweep({ type: 'triangle', from: 140, to: 880, start: now + 0.05, length: 0.6, volume: 0.035 })
  sweep({ type: 'square', from: 988, to: 988, start: now + 0.75, length: 0.14, volume: 0.035 })
}

// Mechanical key click, used for tab and project clicks.
export function playClick() {
  if (!ensureContext()) return
  const now = ctx.currentTime
  noiseBurst({ start: now, length: 0.035, volume: 0.22, filter: 'highpass', frequency: 2500 })
  sweep({ from: 1700, to: 1200, start: now, length: 0.025, volume: 0.04 })
}

// Screen switching off when leaving the monitors: a falling tone and a soft thud.
export function playPowerDown() {
  if (!ensureContext()) return
  const now = ctx.currentTime
  sweep({ from: 720, to: 45, start: now, length: 0.45, volume: 0.1 })
  sweep({ from: 80, to: 40, start: now + 0.05, length: 0.25, volume: 0.25 })
}
