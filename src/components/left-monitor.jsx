import React, { useMemo, useRef } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import MonitorUI from './MonitorUI'

const SCREEN_UI_POSITION = [0, 0, 0.00]
const SCREEN_UI_ROTATION = [0, Math.PI / 1.72, 0]
const SCREEN_UI_SCALE = 0.05

const MATRIX_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>'
const MATRIX_COLUMN_COUNT = 18

function MatrixIdle() {
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

export default function LeftMonitor({ idleVisible = false, uiVisible = false, booting = false, ...props }) {
  const group = useRef()

  const { nodes, scene } = useGLTF('/models/left-monitor.glb')

  const frame =
    nodes?.['left-monitor-frame'] ??
    nodes?.left_monitor_frame ??
    nodes?.MonitorFrame
  const screen =
    nodes?.['left-monitor-screen'] ??
    nodes?.left_monitor_screen ??
    nodes?.MonitorScreen

  const hasNamedParts = useMemo(() => Boolean(frame && screen), [frame, screen])
  const frameMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.6, roughness: 0.4 }),
    []
  )
  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050505',
        emissive: new THREE.Color('#1fff6f'),
        emissiveIntensity: 0.62,
        metalness: 0.2,
        roughness: 0.3,
        side: THREE.FrontSide,
      }),
    []
  )

  return (
    <group ref={group} {...props} dispose={null}>
      {hasNamedParts ? (
        <>
          <mesh
            geometry={frame.geometry}
            position={frame.position}
            rotation={frame.rotation}
            scale={frame.scale}
          >
            <primitive object={frameMaterial} attach="material" />
          </mesh>

          <mesh
            geometry={screen.geometry}
            position={screen.position}
            rotation={screen.rotation}
            scale={screen.scale}
          >
            <primitive object={screenMaterial} attach="material" />
            {(idleVisible || booting || uiVisible) && (
              <Html
                transform
                position={SCREEN_UI_POSITION}
                rotation={SCREEN_UI_ROTATION}
                scale={SCREEN_UI_SCALE}
              >
                <div className="monitor-screen-shell">
                  {idleVisible && <MatrixIdle />}
                  {booting && <div className="monitor-boot-flicker" aria-hidden="true" />}
                  <MonitorUI visible={uiVisible} />
                </div>
              </Html>
            )}
          </mesh>
        </>
      ) : (
        // Fallback so the monitor is still visible even if exported node names differ.
        <primitive object={scene} />
      )}
    </group>
  )
}

// ---------------------------------------------------
// PRELOAD MODEL (PERFORMANCE)
// ---------------------------------------------------
useGLTF.preload('/models/left-monitor.glb')

