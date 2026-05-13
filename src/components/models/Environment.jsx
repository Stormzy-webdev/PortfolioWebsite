import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Environment(props) {
  const { scene } = useGLTF('/models/environment .glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/environment .glb')
