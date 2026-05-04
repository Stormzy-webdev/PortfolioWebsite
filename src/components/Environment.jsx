import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Environment(props) {
  // ---------------------------------------------------
  // LOAD MAIN ENVIRONMENT MODEL
  // ---------------------------------------------------
  // This is your full scene (desk, room, props, etc.)
  // IMPORTANT: should NOT include the left monitor anymore
  const { scene } = useGLTF('/models/pc_setup.glb')

  return (
    <primitive
      object={scene}
      {...props}

      // ---------------------------------------------------
      // WHY THIS MATTERS
      // ---------------------------------------------------
      // This ensures:
      // - correct positioning in world space
      // - ability to move/scale entire environment
      // - clean separation from interactive objects
      position={[0, 0, 0]}
      scale={1}
    />
  )
}

// ---------------------------------------------------
// PRELOAD FOR PERFORMANCE
// ---------------------------------------------------
useGLTF.preload('/models/pc_setup.glb')