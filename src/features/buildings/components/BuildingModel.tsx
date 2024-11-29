import { useRef } from 'react';
import { Building } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function BuildingModel({ building }: { building: Building }) {
  const config = BUILDING_CONFIGS[building.type];
  const groupRef = useRef<THREE.Group>(null);
  
  // Animation à la construction
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const scale = Math.min(1, (clock.getElapsedTime() - building.createdAt) * 2);
      groupRef.current.scale.y = scale;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[building.x, 0, building.z]}
    >
      {/* Base du bâtiment */}
      <mesh
        castShadow
        receiveShadow
        position={[0, config.dimensions.height / 2, 0]}
      >
        <boxGeometry 
          args={[
            config.dimensions.width,
            config.dimensions.height,
            config.dimensions.depth
          ]} 
        />
        <meshStandardMaterial
          color={config.color}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Fenêtres */}
      {Array.from({ length: Math.floor(config.dimensions.height / 2) }).map((_, i) => (
        <group key={i} position={[0, i * 2 + 1, 0]}>
          {Array.from({ length: 4 }).map((_, j) => (
            <mesh
              key={j}
              position={[
                Math.cos((j * Math.PI) / 2) * (config.dimensions.width / 2 - 0.1),
                0,
                Math.sin((j * Math.PI) / 2) * (config.dimensions.depth / 2 - 0.1)
              ]}
              rotation={[0, (j * Math.PI) / 2, 0]}
            >
              <planeGeometry args={[0.8, 1]} />
              <meshStandardMaterial
                color="#87CEEB"
                metalness={0.8}
                roughness={0.2}
                emissive="#87CEEB"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Toit */}
      <mesh
        castShadow
        position={[0, config.dimensions.height, 0]}
      >
        <cylinderGeometry
          args={[
            config.dimensions.width / 2,
            config.dimensions.width / 1.5,
            1,
            8
          ]}
        />
        <meshStandardMaterial
          color={config.color}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}