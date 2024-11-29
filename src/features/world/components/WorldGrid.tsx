import { useRef } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../../store/gameStore';

export function WorldGrid() {
  const gridRef = useRef<THREE.Group>(null);
  const cameraPosition = useGameStore((state) => state.cameraPosition);
  const size = 200;
  const divisions = 50;

  useFrame(() => {
    if (gridRef.current) {
      const gridSize = size / divisions;
      const offsetX = Math.round(cameraPosition.x / gridSize) * gridSize;
      const offsetZ = Math.round(cameraPosition.z / gridSize) * gridSize;
      gridRef.current.position.set(offsetX, 0, offsetZ);
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper
        args={[size, divisions, '#666666', '#444444']}
        position={[0, 0.01, 0]}
      />
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[size, size]}
      >
        <meshStandardMaterial
          color="#303030"
          opacity={0.3}
          transparent
          roughness={1}
          metalness={0}
        />
      </Plane>
    </group>
  );
}