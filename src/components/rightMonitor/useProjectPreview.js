import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function createIdleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 720

  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#0b1624')
  gradient.addColorStop(0.5, '#0f2235')
  gradient.addColorStop(1, '#08111c')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'rgba(143, 235, 255, 0.24)'
  ctx.lineWidth = 3
  ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return { texture, width: canvas.width, height: canvas.height }
}

function fitTexture(texture, sourceWidth, sourceHeight, screenAspect) {
  if (!texture || !sourceWidth || !sourceHeight || !screenAspect) return

  const sourceAspect = sourceWidth / sourceHeight
  let repeatX = 1
  let repeatY = 1

  if (sourceAspect > screenAspect) repeatX = screenAspect / sourceAspect
  else repeatY = sourceAspect / screenAspect

  texture.center.set(0.5, 0.5)
  texture.repeat.set(repeatX, repeatY)
  texture.offset.set((1 - repeatX) * 0.5, (1 - repeatY) * 0.5)
  texture.needsUpdate = true
}

export default function useProjectPreview({ selectedProject, screenAspect, isIdle }) {
  const [preview, setPreview] = useState({
    texture: null,
    type: 'idle',
    project: null,
    transitionKey: 0,
  })

  const transitionIdRef = useRef(0)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    const updatePreview = (next) => {
      transitionIdRef.current += 1
      setPreview((old) => {
        if (old.texture && old.texture !== next.texture) old.texture.dispose?.()
        return { ...next, transitionKey: transitionIdRef.current }
      })
    }

    const useIdle = () => {
      const idle = createIdleTexture()
      fitTexture(idle.texture, idle.width, idle.height, screenAspect)
      updatePreview({ texture: idle.texture, type: 'idle', project: selectedProject || null })
      cleanup = () => idle.texture.dispose()
    }

    const useImage = (imagePath) => {
      const loader = new THREE.TextureLoader()
      loader.load(
        imagePath,
        (texture) => {
          if (disposed) {
            texture.dispose()
            return
          }
          texture.colorSpace = THREE.SRGBColorSpace
          fitTexture(texture, texture.image?.width || 16, texture.image?.height || 9, screenAspect)
          updatePreview({ texture, type: 'image', project: selectedProject || null })
          cleanup = () => texture.dispose()
        },
        undefined,
        () => {
          if (!disposed) useIdle()
        }
      )
    }

    const useVideo = (videoPath) => {
      const video = document.createElement('video')
      video.src = videoPath
      video.crossOrigin = 'anonymous'
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = 'metadata'

      const handleLoaded = () => {
        if (disposed) return
        const texture = new THREE.VideoTexture(video)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        fitTexture(texture, video.videoWidth, video.videoHeight, screenAspect)
        updatePreview({ texture, type: 'video', project: selectedProject || null })

        cleanup = () => {
          video.pause()
          video.removeAttribute('src')
          video.load()
          texture.dispose()
        }
      }

      const handleError = () => {
        if (!disposed && selectedProject?.previewImage) useImage(selectedProject.previewImage)
        else if (!disposed) useIdle()
      }

      video.addEventListener('loadeddata', handleLoaded)
      video.addEventListener('error', handleError)
      video.play().catch(() => {})

      cleanup = () => {
        video.removeEventListener('loadeddata', handleLoaded)
        video.removeEventListener('error', handleError)
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    }

    if (isIdle || !selectedProject) {
      useIdle()
      return () => {
        disposed = true
        cleanup()
      }
    }

    useIdle()

    if (selectedProject.previewVideo) {
      useVideo(selectedProject.previewVideo)
    } else if (selectedProject.previewImage) {
      useImage(selectedProject.previewImage)
    }

    return () => {
      disposed = true
      cleanup()
    }
  }, [isIdle, screenAspect, selectedProject])

  return preview
}
