import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Environment from './components/models/Environment.jsx'
import DeskSetup from './components/models/DeskSetup.jsx'
import Chair from './components/models/Chair.jsx'
import Monitors from './components/models/Monitors.jsx'
import SceneLighting from './components/lighting/SceneLighting.jsx'
import PostProcessing from './components/lighting/PostProcessing.jsx'
import { defaultProjectId, projects } from './data/projects.js'
import './App.css'

const CAMERA_PRESETS = {
  leftMonitor: {
    position: [0.27, 1.01, 0.43],
    target: [-1.02, 1.01, 0.77],
  },
  projectsOverview: {
    position: [0.46, 1.02, 0.21],
    target: [-0.08, 1.02, 0.26],
  },
}

const ZOOM_LERP_FACTOR = 0.025
const ZOOM_COMPLETE_THRESHOLD = 0.02
const LOCK_CAMERA_AFTER_ZOOM = true

function Fog() {
  return <fog attach="fog" args={['#16202d', 5.2, 15.5]} />
}

function CameraZoomController({
  controlsRef,
  shouldZoom,
  goalPosition,
  goalTarget,
  onZoomComplete,
}) {
  const { camera } = useThree()
  const hasCompletedZoom = useRef(false)
  const lastGoalKey = useRef('')

  const targetPosition = useRef(new THREE.Vector3(...goalPosition))
  const targetLookAt = useRef(new THREE.Vector3(...goalTarget))

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'p') {
        const controls = controlsRef.current
        if (!controls) return

        console.log('--- COPY THESE VALUES ---')

        console.log(
          'CAMERA POSITION:',
          `[${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`
        )

        console.log(
          'TARGET:',
          `[${controls.target.x.toFixed(2)}, ${controls.target.y.toFixed(2)}, ${controls.target.z.toFixed(2)}]`
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera, controlsRef])

  useEffect(() => {
    const newGoalKey = `${goalPosition.join(',')}|${goalTarget.join(',')}`
    if (lastGoalKey.current !== newGoalKey) {
      targetPosition.current.set(...goalPosition)
      targetLookAt.current.set(...goalTarget)
      hasCompletedZoom.current = false
      lastGoalKey.current = newGoalKey
    }
  }, [goalPosition, goalTarget])

  useFrame(() => {
    if (!shouldZoom || hasCompletedZoom.current) return

    const controls = controlsRef.current
    if (!controls) return

    camera.position.lerp(targetPosition.current, ZOOM_LERP_FACTOR)
    controls.target.lerp(targetLookAt.current, ZOOM_LERP_FACTOR)
    controls.update()

    const cameraDistance = camera.position.distanceTo(targetPosition.current)
    const targetDistance = controls.target.distanceTo(targetLookAt.current)

    if (
      cameraDistance < ZOOM_COMPLETE_THRESHOLD &&
      targetDistance < ZOOM_COMPLETE_THRESHOLD
    ) {
      hasCompletedZoom.current = true
      onZoomComplete?.()
    }
  })

  return null
}

function App() {
  const controlsRef = useRef()
  const [started, setStarted] = useState(false)
  const [monitorBooting, setMonitorBooting] = useState(false)
  const [showMonitorUI, setShowMonitorUI] = useState(false)
  const [cameraMode, setCameraMode] = useState('leftMonitor')
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId)

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0]

  const handleStart = () => {
    setStarted(true)
  }

  const handleMonitorTabChange = (tab) => {
    if (tab === 'projects') {
      setCameraMode('projectsOverview')
      return
    }
    setCameraMode('leftMonitor')
  }

  useEffect(() => {
    let bootTimer
    if (monitorBooting) {
      bootTimer = setTimeout(() => {
        setMonitorBooting(false)
        setShowMonitorUI(true)
      }, 900)
    }

    return () => {
      if (bootTimer) clearTimeout(bootTimer)
    }
  }, [monitorBooting])

  return (
    <div className="scene-wrapper">
      {!started && (
        <div className="overlay">
          <button className="start-button" data-text="Start" onClick={handleStart}>
            <span>Start</span>
          </button>
        </div>
      )}

      <Canvas
        camera={{ position: [2.72, 2.91, 0.2], fov: 60 }}
        style={{ width: '100vw', height: '100vh' }}
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={['#1b2230']} />
        <Fog />
        <SceneLighting
          focusMode={cameraMode}
          rightActive={showMonitorUI && cameraMode === 'projectsOverview'}
        />

        <Suspense fallback={null}>
          <Environment position={[0, 0, 0]} scale={1} />
          <DeskSetup position={[0, 0, 0]} scale={1} />
          <Chair position={[0, 0, 0]} scale={1} />
          <Monitors
            position={[0, 0, 0]}
            scale={1}
            idleVisible={!monitorBooting && !showMonitorUI}
            uiVisible={showMonitorUI}
            booting={monitorBooting}
            onTabChange={handleMonitorTabChange}
            projects={projects}
            selectedProjectId={selectedProjectId}
            rightMonitorActive={showMonitorUI && cameraMode === 'projectsOverview'}
            onSelectProject={setSelectedProjectId}
          />
        </Suspense>

        <PostProcessing />

        <CameraZoomController
          controlsRef={controlsRef}
          shouldZoom={started}
          goalPosition={CAMERA_PRESETS[cameraMode].position}
          goalTarget={CAMERA_PRESETS[cameraMode].target}
          onZoomComplete={() => {
            if (!showMonitorUI) setMonitorBooting(true)
          }}
        />

        <OrbitControls
          ref={controlsRef}
          target={[0.72, 0.37, 0.2]}
          enableDamping
          dampingFactor={0.05}
          enablePan={!started || !LOCK_CAMERA_AFTER_ZOOM}
          enableZoom={!started || !LOCK_CAMERA_AFTER_ZOOM}
          enableRotate={!started || !LOCK_CAMERA_AFTER_ZOOM}
        />
      </Canvas>
      {showMonitorUI && cameraMode === 'projectsOverview' && (
        <div className="project-preview-hint">Preview selected: {selectedProject?.title}</div>
      )}
    </div>
  )
}

export default App
