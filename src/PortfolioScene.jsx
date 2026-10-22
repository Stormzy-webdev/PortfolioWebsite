import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Environment from './components/models/Environment.jsx'
import DeskSetup from './components/models/DeskSetup.jsx'
import Chair from './components/models/Chair.jsx'
import Monitors from './components/models/Monitors.jsx'
import SceneLighting from './components/lighting/SceneLighting.jsx'
import PostProcessing from './components/lighting/PostProcessing.jsx'
import DustParticles from './components/lighting/DustParticles.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ExitButton from './components/ExitButton.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import {
  isMuted,
  playBoot,
  playClick,
  playPowerDown,
  setMuted,
  startAmbience,
  unlockAudio,
} from './audio/soundEngine.js'
import { defaultProjectId, projects } from './data/projects.js'
import { profile } from './data/profile.js'

// ---------------------------------------------------------------------------
// CAMERA VIEWS
// Every place the camera can fly to. "position" is where the camera sits and
// "target" is the point it looks at. Press P in the browser to log the
// current values when you want to tweak or add a view.
// ---------------------------------------------------------------------------
const CAMERA_VIEWS = {
  // Wide shot of the room, shown on the landing screen (behind the Start button)
  overview: {
    position: [2.72, 2.91, 0.2],
    target: [0.72, 0.37, 0.2],
  },
  // Close-up of the left monitor (About, Skills, Experience, Contact tabs)
  leftMonitor: {
    position: [0.27, 1.01, 0.43],
    target: [-1.02, 1.01, 0.77],
  },
  // Pulled back to frame both monitors (Projects tab + right-screen preview)
  projectsOverview: {
    position: [0.46, 1.02, 0.21],
    target: [-0.08, 1.02, 0.26],
  },
}

// How long one camera move takes, in seconds. Every move takes the same time,
// whether it's a short hop between monitors or the full zoom out of the room.
const CAMERA_MOVE_SECONDS = 1.6

// How long the monitors take to power on (flicker + BIOS text) before the
// Portfolio OS menu appears, in milliseconds. See BootSequence.jsx.
const MONITOR_BOOT_MS = 2200

// The camera is locked in every view (landing screen included): visitors can't
// drag, scroll-zoom or pan it, so they never see past the edges of the room.
// Only the scripted moves in CameraRig (Start, tabs, Exit) move the camera.
// Set to false to let visitors orbit freely again (handy while tweaking views).
const LOCK_CAMERA = true

// Starts slowly, speeds up in the middle and settles gently at the end.
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Fog() {
  return <fog attach="fog" args={['#16202d', 5.2, 15.5]} />
}

// Mounts only once everything inside the Suspense boundary has finished loading.
function SceneReady({ onReady }) {
  useEffect(() => {
    onReady(true)
  }, [onReady])

  return null
}

// ---------------------------------------------------------------------------
// CAMERA RIG
// Smoothly flies the camera to whichever view is passed in. When `view`
// changes, it remembers where the camera is right now and glides from there
// to the new view over CAMERA_MOVE_SECONDS. Starting from the current spot
// means a move can be interrupted (e.g. pressing Exit mid-zoom) and it simply
// turns around. When it arrives it calls onArrive(view).
// ---------------------------------------------------------------------------
function CameraRig({ controlsRef, view, onArrive }) {
  const { camera } = useThree()
  const move = useRef(null)
  const lastView = useRef(view)

  // Debug helper: press P to log the current camera position and target.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() !== 'p') return
      // Don't fire while someone is typing (e.g. in the terminal).
      if (e.target instanceof HTMLInputElement) return
      const controls = controlsRef.current
      if (!controls) return
      const fmt = (v) => `[${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}]`
      console.log('--- COPY THESE VALUES ---')
      console.log('CAMERA POSITION:', fmt(camera.position))
      console.log('TARGET:', fmt(controls.target))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera, controlsRef])

  // A new view was requested: plan a move from wherever the camera is now.
  useEffect(() => {
    if (lastView.current === view) return
    lastView.current = view

    const controls = controlsRef.current
    if (!controls) return

    move.current = {
      view,
      elapsed: 0,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toPosition: new THREE.Vector3(...CAMERA_VIEWS[view].position),
      toTarget: new THREE.Vector3(...CAMERA_VIEWS[view].target),
    }
  }, [view, camera, controlsRef])

  // Each frame, step the planned move forward a little.
  useFrame((_, delta) => {
    const current = move.current
    const controls = controlsRef.current
    if (!current || !controls) return

    // Cap the step so coming back from another browser tab mid-move doesn't
    // make the camera jump, while still keeping time on slower computers.
    current.elapsed += Math.min(delta, 0.1)
    const progress = Math.min(current.elapsed / CAMERA_MOVE_SECONDS, 1)
    const eased = easeInOutCubic(progress)

    camera.position.lerpVectors(current.fromPosition, current.toPosition, eased)
    controls.target.lerpVectors(current.fromTarget, current.toTarget, eased)
    // Ignore mouse dragging while the camera is flying so the two don't fight.
    controls.enabled = false
    controls.update()

    if (progress >= 1) {
      move.current = null
      controls.enabled = true
      onArrive?.(current.view)
    }
  })

  return null
}

function PortfolioScene() {
  const controlsRef = useRef()
  const [sceneReady, setSceneReady] = useState(false)
  // true from clicking Start until the visitor exits back to the room view
  const [started, setStarted] = useState(false)
  const [monitorBooting, setMonitorBooting] = useState(false)
  const [showMonitorUI, setShowMonitorUI] = useState(false)
  const [activeMonitorTab, setActiveMonitorTab] = useState('about')
  // What the left monitor shows once booted: the Portfolio OS 'menu', or the
  // hidden 'terminal' (opened by clicking the keyboard in the room).
  const [screenMode, setScreenMode] = useState('menu')
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId)
  const [soundMuted, setSoundMuted] = useState(isMuted)

  // Which monitor view the open tab needs: Projects frames both screens so the
  // right-hand preview is visible, every other tab sits on the left monitor.
  const cameraMode = activeMonitorTab === 'projects' ? 'projectsOverview' : 'leftMonitor'
  const cameraView = started ? cameraMode : 'overview'

  const rightMonitorMode = !showMonitorUI ? 'off' : activeMonitorTab === 'projects' ? 'project' : 'idle'

  // Clicking Start is the visitor's first click, which is what browsers need
  // before a site may play sound, so this is where the room hum begins.
  const handleStart = () => {
    unlockAudio()
    startAmbience()
    setStarted(true)
  }

  // Keyboard Easter egg: same zoom and boot as Start, but the monitor opens
  // the terminal instead of the menu.
  const handleOpenTerminal = () => {
    setScreenMode('terminal')
    handleStart()
  }

  // The ">_ terminal" button in the Portfolio OS menu. The terminal lives on
  // the left monitor, so switch back to About first (moves the camera there
  // if the visitor was on Projects, and is where `exit` returns to).
  const handleOpenTerminalFromMenu = () => {
    playClick()
    setActiveMonitorTab('about')
    setScreenMode('terminal')
  }

  // -------------------------------------------------------------------------
  // SOUND TOGGLE
  // Mutes/unmutes everything. Turning sound on also counts as the visitor's
  // first click, so the room hum can start even before they press Start.
  // -------------------------------------------------------------------------
  const handleToggleSound = () => {
    const nextMuted = !soundMuted
    setMuted(nextMuted)
    setSoundMuted(nextMuted)
    if (!nextMuted) {
      unlockAudio()
      startAmbience()
    }
  }

  const handleTabChange = (tab) => {
    if (tab !== activeMonitorTab) playClick()
    setActiveMonitorTab(tab)
  }

  // -------------------------------------------------------------------------
  // EXIT
  // Takes the visitor back out to the room: the camera flies back to the
  // overview, the monitors return to their idle Matrix screens, the tabs reset
  // to About and the Start button comes back. Triggered by the Exit button or
  // the Escape key.
  // -------------------------------------------------------------------------
  const handleExit = useCallback(() => {
    playPowerDown()
    setStarted(false)
    setMonitorBooting(false)
    setShowMonitorUI(false)
    setActiveMonitorTab('about')
    setScreenMode('menu')
  }, [])

  useEffect(() => {
    if (!started) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleExit()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [started, handleExit])

  // When the camera finishes zooming in for the first time, power the monitors on.
  const handleCameraArrive = (view) => {
    if (view !== 'overview' && !showMonitorUI && !monitorBooting) setMonitorBooting(true)
  }

  const handleProjectHover = (projectId) => {
    setSelectedProjectId(projectId)
  }

  const handleProjectSelect = (projectId) => {
    playClick()
    setSelectedProjectId(projectId)
  }

  // Monitor power-on: play the boot sound, show the flicker + BIOS text for
  // MONITOR_BOOT_MS, then switch to the Portfolio OS menu.
  useEffect(() => {
    let bootTimer
    if (monitorBooting) {
      playBoot()
      bootTimer = setTimeout(() => {
        setMonitorBooting(false)
        setShowMonitorUI(true)
      }, MONITOR_BOOT_MS)
    }

    return () => {
      if (bootTimer) clearTimeout(bootTimer)
    }
  }, [monitorBooting])

  return (
    <div className="scene-wrapper">
      <LoadingScreen ready={sceneReady} />

      {sceneReady && !started && (
        <div className="overlay">
          {/* Who this is, so visitors know whose portfolio it is before clicking anything */}
          <div className="landing-title">
            <h1 className="landing-title__name" data-text={profile.name}>
              {profile.name}
            </h1>
            <p className="landing-title__role">{profile.role}</p>
          </div>
          <button className="start-button" data-text="Start" onClick={handleStart}>
            <span>Start</span>
          </button>
          <p className="start-hint">psst... try clicking the keyboard</p>
        </div>
      )}

      {started && <ExitButton onExit={handleExit} />}
      {sceneReady && <SoundToggle muted={soundMuted} onToggle={handleToggleSound} />}

      <Canvas
        camera={{ position: CAMERA_VIEWS.overview.position, fov: 60 }}
        style={{ width: '100vw', height: '100vh' }}
        shadows
        dpr={[1, 1.75]}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          // Overall lighting control
          toneMappingExposure: 0.5,
          outputColorSpace: THREE.SRGBColorSpace,
          useLegacyLights: false,
        }}
      >
        <color attach="background" args={['#1b2230']} />
        <Fog />
        <SceneLighting
          focusMode={cameraMode}
          rightActive={rightMonitorMode === 'project'}
        />

        <Suspense fallback={null}>
          <Environment position={[0, 0, 0]} scale={1} />
          <DeskSetup
            position={[0, 0, 0]}
            scale={1}
            keyboardInteractive={sceneReady && !started}
            onKeyboardClick={handleOpenTerminal}
          />
          <Chair position={[0, 0, 0]} scale={1} />
          <Monitors
            position={[0, 0, 0]}
            scale={1}
            idleVisible={!monitorBooting && !showMonitorUI}
            uiVisible={showMonitorUI}
            booting={monitorBooting}
            activeTab={activeMonitorTab}
            onTabChange={handleTabChange}
            screenMode={screenMode}
            onTerminalExit={() => setScreenMode('menu')}
            onOpenTerminal={handleOpenTerminalFromMenu}
            projects={projects}
            selectedProjectId={selectedProjectId}
            rightMonitorMode={rightMonitorMode}
            rightMonitorBooting={monitorBooting}
            onProjectHover={handleProjectHover}
            onProjectSelect={handleProjectSelect}
          />
          <SceneReady onReady={setSceneReady} />
        </Suspense>

        <DustParticles />

        <PostProcessing />

        <CameraRig controlsRef={controlsRef} view={cameraView} onArrive={handleCameraArrive} />

        <OrbitControls
          ref={controlsRef}
          target={CAMERA_VIEWS.overview.target}
          enableDamping
          dampingFactor={0.05}
          enablePan={!LOCK_CAMERA}
          enableZoom={!LOCK_CAMERA}
          enableRotate={!LOCK_CAMERA}
        />
      </Canvas>
    </div>
  )
}

export default PortfolioScene
