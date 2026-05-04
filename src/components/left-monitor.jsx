import React, { useMemo, useRef } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import MonitorUI from './MonitorUI'

const SCREEN_UI_POSITION = [0, 0, 0.00]
const SCREEN_UI_ROTATION = [0, Math.PI / 1.72, 0]
const SCREEN_UI_SCALE = 0.05

export default function LeftMonitor({ uiVisible = false, ...props }) {
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
        emissive: new THREE.Color('#00f5ff'),
        emissiveIntensity: 1.4,
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
            {uiVisible && (
              <Html
                transform
                position={SCREEN_UI_POSITION}
                rotation={SCREEN_UI_ROTATION}
                scale={SCREEN_UI_SCALE}
              >
                <MonitorUI />
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

