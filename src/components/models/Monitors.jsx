import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import MonitorUI from '../MonitorUI'

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

function createFallbackTexture(label = 'Project Preview') {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 576

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#06160d'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#0c3b22')
  gradient.addColorStop(1, '#042012')
  ctx.fillStyle = gradient
  ctx.fillRect(32, 32, canvas.width - 64, canvas.height - 64)

  ctx.strokeStyle = '#62ff87'
  ctx.lineWidth = 6
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64)

  ctx.fillStyle = '#dfffe7'
  ctx.font = '700 46px sans-serif'
  ctx.fillText('PROJECT PREVIEW', 70, 130)

  ctx.font = '500 34px sans-serif'
  ctx.fillStyle = '#9fffb9'
  const clipped = label.length > 40 ? `${label.slice(0, 40)}...` : label
  ctx.fillText(clipped, 70, 210)

  ctx.font = '400 24px sans-serif'
  ctx.fillStyle = '#88d99f'
  ctx.fillText('Add /public/previews/*.mp4 for live playback', 70, 285)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function fitTextureToAspect(texture, sourceWidth, sourceHeight, screenAspect) {
  if (!texture || !sourceWidth || !sourceHeight || !screenAspect) return

  const sourceAspect = sourceWidth / sourceHeight
  let repeatX = 1
  let repeatY = 1

  if (sourceAspect > screenAspect) {
    repeatX = screenAspect / sourceAspect
  } else {
    repeatY = sourceAspect / screenAspect
  }

  texture.center.set(0.5, 0.5)
  texture.repeat.set(repeatX, repeatY)
  texture.offset.set((1 - repeatX) * 0.5, (1 - repeatY) * 0.5)
  texture.needsUpdate = true
}

function useRightScreenTexture(selectedProject, screenAspect) {
  const [materialMap, setMaterialMap] = useState(null)

  useEffect(() => {
    if (!selectedProject) return undefined

    let disposed = false
    let cleanup = () => {}

    const applyCanvasFallback = () => {
      const canvasTexture = createFallbackTexture(selectedProject.title)
      fitTextureToAspect(canvasTexture, 16, 9, screenAspect)
      setMaterialMap((old) => {
        if (old && old !== canvasTexture) old.dispose?.()
        return canvasTexture
      })
      cleanup = () => canvasTexture.dispose()
    }

    const applyImageFallback = () => {
      if (!selectedProject.previewImage) {
        applyCanvasFallback()
        return
      }

      const loader = new THREE.TextureLoader()
      loader.load(
        selectedProject.previewImage,
        (imageTexture) => {
          if (disposed) {
            imageTexture.dispose()
            return
          }
          imageTexture.colorSpace = THREE.SRGBColorSpace
          fitTextureToAspect(
            imageTexture,
            imageTexture.image?.width || 16,
            imageTexture.image?.height || 9,
            screenAspect
          )
          setMaterialMap((old) => {
            if (old && old !== imageTexture) old.dispose?.()
            return imageTexture
          })
          cleanup = () => imageTexture.dispose()
        },
        undefined,
        () => {
          if (!disposed) applyCanvasFallback()
        }
      )
    }

    if (!selectedProject.previewVideo) {
      applyImageFallback()
      return () => cleanup()
    }

    const video = document.createElement('video')
    video.src = selectedProject.previewVideo
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'metadata'

    const handleLoaded = () => {
      if (disposed) return
      const videoTexture = new THREE.VideoTexture(video)
      videoTexture.colorSpace = THREE.SRGBColorSpace
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      fitTextureToAspect(videoTexture, video.videoWidth, video.videoHeight, screenAspect)

      setMaterialMap((old) => {
        if (old && old !== videoTexture) old.dispose?.()
        return videoTexture
      })

      cleanup = () => {
        video.pause()
        video.removeAttribute('src')
        video.load()
        videoTexture.dispose()
      }
    }

    const handleError = () => {
      if (!disposed) applyImageFallback()
    }

    video.addEventListener('loadeddata', handleLoaded)
    video.addEventListener('error', handleError)

    video
      .play()
      .then(() => {})
      .catch(() => {
        /* no-op; loadeddata/error handlers handle fallback */
      })

    return () => {
      disposed = true
      video.removeEventListener('loadeddata', handleLoaded)
      video.removeEventListener('error', handleError)
      cleanup()
    }
  }, [selectedProject, screenAspect])

  return materialMap
}

export default function Monitors({
  idleVisible = false,
  uiVisible = false,
  booting = false,
  onTabChange,
  projects = [],
  selectedProjectId,
  rightMonitorActive = false,
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

  const screenAspect = useMemo(() => {
    if (!rightScreen?.geometry) return 16 / 9
    const bbox = new THREE.Box3().setFromBufferAttribute(rightScreen.geometry.attributes.position)
    const size = new THREE.Vector3()
    bbox.getSize(size)
    return size.x > 0 && size.y > 0 ? size.x / size.y : 16 / 9
  }, [rightScreen])

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || projects[0],
    [projects, selectedProjectId]
  )

  const previewMap = useRightScreenTexture(selectedProject, screenAspect)
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

          <mesh geometry={leftScreen.geometry} position={leftScreen.position} rotation={leftScreen.rotation} scale={leftScreen.scale}>
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

          <mesh geometry={rightScreen.geometry} position={rightScreen.position} rotation={rightScreen.rotation} scale={rightScreen.scale}>
            <meshStandardMaterial
              map={previewMap || null}
              emissiveMap={previewMap || null}
              emissive={new THREE.Color('#9ae7ff')}
              emissiveIntensity={rightMonitorActive ? 1.35 : 0.92}
              metalness={0.08}
              roughness={0.18}
              toneMapped={false}
            />
          </mesh>
        </>
      ) : (
        <primitive object={scene} />
      )}
    </group>
  )
}

useGLTF.preload('/models/monitors.glb')
