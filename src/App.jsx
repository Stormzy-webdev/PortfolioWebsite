import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import SetupModel from './components/SetupModel.jsx'
import LeftMonitor from './components/left-monitor.jsx'
import './App.css'

// 🎯 Replace these AFTER pressing "P" and copying from console
const LEFT_MONITOR_CAMERA_POSITION = [0.28, 1.01, 0.53]
const LEFT_MONITOR_TARGET = [-1.05, 1.00, 0.73]

const ZOOM_LERP_FACTOR = 0.025
const ZOOM_COMPLETE_THRESHOLD = 0.02
const LOCK_CAMERA_AFTER_ZOOM = false

function Fog() {
  return <fog attach="fog" args={['#1b2230', 5, 12]} />
}

function CameraZoomController({ controlsRef, shouldZoom, onZoomComplete }) {
  const { camera } = useThree()
  const hasCompletedZoom = useRef(false)

  const targetPosition = useRef(new THREE.Vector3(...LEFT_MONITOR_CAMERA_POSITION))
  const targetLookAt = useRef(new THREE.Vector3(...LEFT_MONITOR_TARGET))

  // ✅ DEBUG KEY (PRESS "P")
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
      onZoomComplete()
    }
  })

  return null
}

function App() {
  const controlsRef = useRef()
  const [started, setStarted] = useState(false)
  const [monitorBooting, setMonitorBooting] = useState(false)
  const [showMonitorUI, setShowMonitorUI] = useState(false)

  const handleStart = () => {
    setStarted(true)
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
      >
        <color attach="background" args={['#1b2230']} />
        <Fog />

        <ambientLight intensity={0.75} color="#dbe7ff" />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.1}
          color="#fff4d6"
          castShadow={false}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#9ac7ff" />
        <pointLight position={[0, 3, 0]} intensity={0.35} color="#b8ffe0" />

        <Suspense fallback={null}>
          <SetupModel />
          <LeftMonitor
            position={[0, 0, 0]}
            scale={1}
            idleVisible={!started}
            uiVisible={showMonitorUI}
            booting={monitorBooting}
          />
        </Suspense>

        <CameraZoomController
          controlsRef={controlsRef}
          shouldZoom={started}
          onZoomComplete={() => setMonitorBooting(true)}
        />

        <OrbitControls
          ref={controlsRef}
          target={[0.72, 0.37, 0.2]} // You can adjust this later
          enableDamping
          dampingFactor={0.05}
          enablePan={!LOCK_CAMERA_AFTER_ZOOM || !showMonitorUI}
          enableZoom={!LOCK_CAMERA_AFTER_ZOOM || !showMonitorUI}
          enableRotate={!LOCK_CAMERA_AFTER_ZOOM || !showMonitorUI}
        />
      </Canvas>
    </div>
  )
}

export default App
