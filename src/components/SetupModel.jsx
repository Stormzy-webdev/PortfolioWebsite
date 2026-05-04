import React from 'react'   
import { useGLTF } from '@react-three/drei'

export default function SetupModel() {
  // Load your Blender model
  const { scene } = useGLTF('/models/pc_setup.glb') // Adjust the path to your model
  return (
    <primitive
      object={scene}       // insert the loaded scene
      position={[0, 0, 0]} // adjust position in your scene
      scale={1}            // adjust size
    />
  )
}