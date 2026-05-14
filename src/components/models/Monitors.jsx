import React, { useMemo } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import MonitorUI from '../MonitorUI'
import RightMonitorDisplay from '../rightMonitor/RightMonitorDisplay'

const SCREEN_UI_POSITION = [0, 0, 0.0]
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

export default function Monitors({
  idleVisible = false,
  uiVisible = false,
  booting = false,
  onTabChange,
  projects = [],
  selectedProjectId,
  rightMonitorMode = 'off',
  onSelectProject,
  ...props
}) {
  const { nodes, scene } = useGLTF('/models/monitors.glb')

  const leftFrame = nodes?.['left-monitor-frame']
  const leftScreen = nodes?.['left-monitor-screen']
  const rightFrame = nodes?.['right-monitor-frame']
  const rightScreen = nodes?.['right-monitor-screen']

  const hasNamedParts = useMemo(
    () => Boolean(leftFrame && leftScreen && rightFrame && rightScreen),
    [leftFrame, leftScreen, rightFrame, rightScreen]
  )

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || projects[0] || null,
    [projects, selectedProjectId]
  )

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#090909',
        metalness: 0.45,
        roughness: 0.5,
      }),
    []
  )

  return (
    <group {...props} dispose={null}>
      {hasNamedParts ? (
        <>
          <mesh
            geometry={leftFrame.geometry}
            material={frameMaterial}
            position={leftFrame.position}
            rotation={leftFrame.rotation}
            scale={leftFrame.scale}
          />

          <mesh
            geometry={leftScreen.geometry}
            position={leftScreen.position}
            rotation={leftScreen.rotation}
            scale={leftScreen.scale}
          >
            <meshStandardMaterial
              color="#050505"
              emissive={new THREE.Color('#1fff6f')}
              emissiveIntensity={0.62}
              metalness={0.2}
              roughness={0.3}
              side={THREE.FrontSide}
            />
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
                  <MonitorUI
                    visible={uiVisible}
                    onTabChange={onTabChange}
                    projects={projects}
                    selectedProjectId={selectedProject?.id}
                    onSelectProject={onSelectProject}
                  />
                </div>
              </Html>
            )}
          </mesh>

          <mesh
            geometry={rightFrame.geometry}
            material={frameMaterial}
            position={rightFrame.position}
            rotation={rightFrame.rotation}
            scale={rightFrame.scale}
          />

          <RightMonitorDisplay
            screen={rightScreen}
            selectedProject={selectedProject}
            mode={rightMonitorMode}
            booting={booting}
          />
        </>
      ) : (
        <primitive object={scene} />
      )}
    </group>
  )
}

useGLTF.preload('/models/monitors.glb')
