import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ===========================================================================
// RIGHT MONITOR: SCREEN GLOW
// The glowing 3D surface of the right monitor, underneath its HTML screen.
// It shows a dark blue gradient with a thin frame and gives off a soft purple
// glow (brighter while a project is shown). The project recordings themselves
// play as a real <video> in the HTML layer (ProjectInfoOverlay.jsx), so this
// surface never loads any media.
//
// When the selected project changes (refreshKey), the glow dips and fades
// back in, like an old monitor redrawing.
// ===========================================================================

// Draws the gradient + frame onto a canvas once, scaled to fit the screen's
// shape so the frame isn't stretched.
function createScreenTexture(screenAspect) {
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

  // Fit the 16:9 drawing to the screen's actual shape without stretching it.
  const sourceAspect = canvas.width / canvas.height
  const repeatX = sourceAspect > screenAspect ? screenAspect / sourceAspect : 1
  const repeatY = sourceAspect > screenAspect ? 1 : sourceAspect / screenAspect
  texture.center.set(0.5, 0.5)
  texture.repeat.set(repeatX, repeatY)
  texture.offset.set((1 - repeatX) * 0.5, (1 - repeatY) * 0.5)
  return texture
}

const GLOW_COLOR = new THREE.Color('#b18eff')

export default function ScreenGlow({ geometry, transform, active = false, refreshKey }) {
  const materialRef = useRef()
  const texture = useMemo(() => createScreenTexture(transform.screenAspect), [transform.screenAspect])

  // Free the texture's GPU memory when it's replaced or the screen unmounts.
  useEffect(() => () => texture.dispose(), [texture])

  // Dip the glow whenever the shown project changes...
  useEffect(() => {
    if (materialRef.current) materialRef.current.opacity = 0.08
  }, [refreshKey])

  // ...and ease it back up every frame.
  const targetOpacity = active ? 1 : 0.86
  useFrame((_, delta) => {
    const material = materialRef.current
    if (material) material.opacity = THREE.MathUtils.damp(material.opacity, targetOpacity, 6.5, delta)
  })

  return (
    <mesh geometry={geometry} position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <meshStandardMaterial
        ref={materialRef}
        transparent
        map={texture}
        emissiveMap={texture}
        emissive={GLOW_COLOR}
        emissiveIntensity={active ? 0.88 : 0.68}
        color="#6f8ea7"
        metalness={0.08}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  )
}
