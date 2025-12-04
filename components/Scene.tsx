import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import NeedleSystem from './NeedleSystem';
import DecorationSystem from './DecorationSystem';
import { TreeMorphState, AppState } from '../types';

interface SceneProps {
  appState: AppState;
}

const RotatingGroup = ({ isRotating, children }: { isRotating: boolean; children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const Scene: React.FC<SceneProps> = ({ appState }) => {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      
      {/* Lighting - Moody and Dramatic */}
      <ambientLight intensity={0.2} color="#240046" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF007F" distance={50} />
      <pointLight position={[-10, -5, -10]} intensity={1.5} color="#00F0FF" distance={50} />
      <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} color="#C0C0C0" castShadow />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <RotatingGroup isRotating={appState.isRotating}>
        <NeedleSystem morphState={appState.morphState} />
        <DecorationSystem morphState={appState.morphState} />
      </RotatingGroup>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={10} 
        maxDistance={60} 
        autoRotate={false}
      />

      {/* Post Processing for Y2K/Cyberpunk feel */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.4} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;