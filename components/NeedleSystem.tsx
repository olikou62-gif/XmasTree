import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS } from '../constants';
import { DualPosition, TreeMorphState } from '../types';
import { getScatterPosition, getTreePosition, randomRange } from '../utils/math';

interface NeedleSystemProps {
  morphState: TreeMorphState;
}

const NeedleSystem: React.FC<NeedleSystemProps> = ({ morphState }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize Data
  const data = useMemo(() => {
    const items: DualPosition[] = [];
    const tempColor = new THREE.Color();

    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      const scatterPos = getScatterPosition();
      // Needles concentrated more at bottom, thinning at top slightly, but generally full volume
      const h = Math.pow(Math.random(), 0.8); // Bias slightly lower
      const treePos = getTreePosition(h);
      
      // Mix Pine Green with Silver and Cyber Blue
      const rand = Math.random();
      let color = COLORS.NEON_GREEN.clone();
      if (rand > 0.8) color = COLORS.SILVER.clone();
      if (rand > 0.95) color = COLORS.CYBER_BLUE.clone();

      items.push({
        id: i,
        scatterPos,
        treePos,
        currentPos: scatterPos.clone(), // Start scattered
        rotationSpeed: new THREE.Vector3(),
        color,
        scale: 1,
        type: 'NEEDLE'
      });
    }
    return items;
  }, []);

  // Initialize Geometry Attributes
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(CONFIG.NEEDLE_COUNT * 3);
    const colors = new Float32Array(CONFIG.NEEDLE_COUNT * 3);

    data.forEach((d, i) => {
      positions[i * 3] = d.currentPos.x;
      positions[i * 3 + 1] = d.currentPos.y;
      positions[i * 3 + 2] = d.currentPos.z;

      colors[i * 3] = d.color.r;
      colors[i * 3 + 1] = d.color.g;
      colors[i * 3 + 2] = d.color.b;
    });

    return { positions, colors };
  }, [data]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const isTree = morphState === TreeMorphState.TREE_SHAPE;
    
    // Smooth damp speed
    const alpha = 1 - Math.pow(0.01, delta * 0.8); // Lerp factor

    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      const item = data[i];
      const target = isTree ? item.treePos : item.scatterPos;
      
      // Interpolate current position
      item.currentPos.lerp(target, alpha);

      // Add a slight hover noise for life
      const time = state.clock.elapsedTime;
      const noise = Math.sin(time * 2 + item.id) * 0.02;
      
      positionsAttr.setXYZ(
        i, 
        item.currentPos.x + (isTree ? noise : noise * 5), // More chaos when scattered
        item.currentPos.y + noise, 
        item.currentPos.z + (isTree ? noise : noise * 5)
      );
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

export default NeedleSystem;
