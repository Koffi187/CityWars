import { useEffect } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

export function Grid() {
  const size = 100;
  const divisions = 20;

  useEffect(() => {
    const grid = new THREE.GridHelper(size, divisions);
    return () => {
      grid.dispose();
    };
  }, []);

  return (
    <group>
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        args={[size, size]}
      >
        <meshStandardMaterial color="#303030" />
      </Plane>
    </group>
  );
}