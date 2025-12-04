import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS, SHAPES } from '../constants';
import { DualPosition, TreeMorphState } from '../types';
import { getScatterPosition, getTreeSurfacePosition, randomRange } from '../utils/math';

interface DecorationSystemProps {
  morphState: TreeMorphState;
}

// Reusable dummy object for matrix calculations
const dummy = new THREE.Object3D();

const DecorationSystem: React.FC<DecorationSystemProps> = ({ morphState }) => {
  // We use different InstancedMeshes for different geometries to vary the look
  const meshRefs = {
    SPHERE: useRef<THREE.InstancedMesh>(null),
    BOX: useRef<THREE.InstancedMesh>(null),
    OCTAHEDRON: useRef<THREE.InstancedMesh>(null),
    TORUS: useRef<THREE.InstancedMesh>(null),
  };

  // Prepare Data
  const data = useMemo(() => {
    const items: DualPosition[] = [];
    
    // Distribute shapes
    const countPerShape = Math.floor(CONFIG.DECORATION_COUNT / SHAPES.length);

    SHAPES.forEach(shapeType => {
      for (let i = 0; i < countPerShape; i++) {
        const scatterPos = getScatterPosition();
        const h = Math.random(); // Uniform vertical distribution
        const treePos = getTreeSurfacePosition(h);
        
        // Aesthetic colors: Pink, Silver, Purple
        const rand = Math.random();
        let color = COLORS.BARBIE_PINK.clone();
        if (rand > 0.4) color = COLORS.SILVER.clone();
        if (rand > 0.7) color = COLORS.DEEP_PURPLE.clone();

        // Scale variation
        const scale = randomRange(0.2, 0.45);

        items.push({
          id: items.length,
          scatterPos,
          treePos,
          currentPos: scatterPos.clone(),
          rotationSpeed: new THREE.Vector3(
            randomRange(-1, 1), randomRange(-1, 1), randomRange(-1, 1)
          ),
          color,
          scale,
          type: 'DECORATION',
          shape: shapeType
        });
      }
    });
    return items;
  }, []);

  // Loop
  useFrame((state, delta) => {
    const isTree = morphState === TreeMorphState.TREE_SHAPE;
    const time = state.clock.elapsedTime;
    const alpha = 1 - Math.pow(0.01, delta * 1.5); // Slower, heavier feel for decorations

    let indices = { SPHERE: 0, BOX: 0, OCTAHEDRON: 0, TORUS: 0 };

    data.forEach((item) => {
      // 1. Position Interpolation
      const target = isTree ? item.treePos : item.scatterPos;
      item.currentPos.lerp(target, alpha);

      // 2. Rotation Animation
      dummy.position.copy(item.currentPos);
      
      // Rotate objects continuously
      dummy.rotation.x += item.rotationSpeed.x * delta;
      dummy.rotation.y += item.rotationSpeed.y * delta;
      
      // Add floating bobbing
      dummy.position.y += Math.sin(time * 3 + item.id) * 0.05;

      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();

      const ref = meshRefs[item.shape!];
      const idx = indices[item.shape!];
      
      if (ref.current) {
        ref.current.setMatrixAt(idx, dummy.matrix);
        // We set color once initially, but could update here if needed
        ref.current.setColorAt(idx, item.color);
      }
      indices[item.shape!]++;
    });

    // Notify ThreeJS to update
    Object.values(meshRefs).forEach(ref => {
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
      }
    });
  });

  return (
    <group>
      {/* Spheres (Planets/Baubles) */}
      <instancedMesh ref={meshRefs.SPHERE} args={[undefined, undefined, CONFIG.DECORATION_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial roughness={0.2} metalness={0.8} emissive={COLORS.DEEP_PURPLE} emissiveIntensity={0.5} />
      </instancedMesh>

      {/* Boxes (Gifts/Pixels) */}
      <instancedMesh ref={meshRefs.BOX} args={[undefined, undefined, CONFIG.DECORATION_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.1} metalness={0.9} />
      </instancedMesh>

      {/* Octahedrons (Jewels/Ships) */}
      <instancedMesh ref={meshRefs.OCTAHEDRON} args={[undefined, undefined, CONFIG.DECORATION_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.1} metalness={1} emissive={COLORS.BARBIE_PINK} emissiveIntensity={0.8} />
      </instancedMesh>

      {/* Torus (Music Notes/Rings) */}
      <instancedMesh ref={meshRefs.TORUS} args={[undefined, undefined, CONFIG.DECORATION_COUNT]}>
        <torusGeometry args={[0.8, 0.2, 8, 20]} />
        <meshStandardMaterial roughness={0.3} metalness={0.6} color={COLORS.CYBER_BLUE} />
      </instancedMesh>
    </group>
  );
};

export default DecorationSystem;
