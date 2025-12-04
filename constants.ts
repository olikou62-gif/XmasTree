import * as THREE from 'three';

export const COLORS = {
  SILVER: new THREE.Color('#C0C0C0'),
  BARBIE_PINK: new THREE.Color('#FF007F'),
  NEON_GREEN: new THREE.Color('#00FF41'),
  DEEP_PURPLE: new THREE.Color('#240046'),
  CYBER_BLUE: new THREE.Color('#00F0FF'),
};

export const CONFIG = {
  NEEDLE_COUNT: 3500,
  DECORATION_COUNT: 150,
  TREE_HEIGHT: 12,
  TREE_RADIUS: 5,
  SCATTER_RADIUS: 25,
  ANIMATION_SPEED: 2.5, // Lerp speed
};

export const SHAPES = ['SPHERE', 'BOX', 'OCTAHEDRON', 'TORUS'] as const;
