import React, { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import ProjectPreview from './ProjectPreview'
import ProjectInfoOverlay from './ProjectInfoOverlay'
import IdleDisplay from './IdleDisplay'


// Right Monitor UI control
const UI_POSITION = [0.0, 0.138, -0.002]
const UI_SCALE = 0.043
const UI_ROTATION = [0, 1.4, 0]

export default function RightMonitorDisplay({
  screen,
  selectedProject,
  isIdle = false,
  active = false,
}) {
  const transform = useMemo(() => {
    const screenAspect = (() => {
      if (!screen?.geometry) return 16 / 9
      const bbox = new THREE.Box3().setFromBufferAttribute(screen.geometry.attributes.position)
      const size = new THREE.Vector3()
      bbox.getSize(size)
      return size.x > 0 && size.y > 0 ? size.x / size.y : 16 / 9
    })()

    return {
      position: screen.position,
      rotation: screen.rotation,
      scale: screen.scale,
      screenAspect,
    }
  }, [screen])

  return (
    <>
      <ProjectPreview
        geometry={screen.geometry}
        transform={transform}
        selectedProject={selectedProject}
        isIdle={isIdle}
        active={active}
      />

      <mesh
        geometry={screen.geometry}
        position={transform.position}
        rotation={transform.rotation}
        scale={transform.scale}
      >
        <meshBasicMaterial transparent opacity={0.06} color="#c2ecff" toneMapped={false} />
      </mesh>

      <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
        <Html transform position={UI_POSITION} rotation={UI_ROTATION} scale={UI_SCALE}>
          <div className={`right-monitor-overlay ${active ? 'is-active' : ''}`}>
            <div className="right-monitor-overlay__scan" />
            <IdleDisplay visible={isIdle} />
            <ProjectInfoOverlay project={selectedProject} visible={!isIdle} />
          </div>
        </Html>
      </group>
    </>
  )
}
