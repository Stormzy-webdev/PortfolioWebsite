import React from 'react'
import { EffectComposer, Bloom, Vignette, ToneMapping, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.66}
        luminanceSmoothing={0.24}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.00035, 0.00025)}
        radialModulation
        modulationOffset={0.2}
      />
      <Vignette eskil={false} offset={0.16} darkness={0.3} />
    </EffectComposer>
  )
}
