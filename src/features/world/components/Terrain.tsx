import { useRef } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

export function Terrain() {
  const terrainRef = useRef<THREE.Mesh>(null);

  return (
    <Plane
      ref={terrainRef}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      args={[1000, 1000]}
    >
      <meshStandardMaterial
        color="#4a9375"
        metalness={0.1}
        roughness={0.8}
      >
        <planeGeometry args={[1000, 1000, 100, 100]} />
      </meshStandardMaterial>
    </Plane>
  );
}