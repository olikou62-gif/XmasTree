import * as THREE from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface DualPosition {
  id: number;
  scatterPos: THREE.Vector3;
  treePos: THREE.Vector3;
  currentPos: THREE.Vector3; // For tracking animation state
  rotationSpeed: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  type: 'NEEDLE' | 'DECORATION';
  shape?: 'SPHERE' | 'BOX' | 'OCTAHEDRON' | 'TORUS'; // For decorations
}

export interface AppState {
  morphState: TreeMorphState;
  setMorphState: (state: TreeMorphState) => void;
  isRotating: boolean;
  setIsRotating: (rotating: boolean) => void;
}
