import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Building } from '../types';
import { useGameStore } from '../../../store/gameStore';

interface InteriorSceneProps {
  building: Building;
  isOwner: boolean;
  selectedFurniture: string | null;
  onSelectFurniture: (id: string | null) => void;
}

export function InteriorScene({ 
  building, 
  isOwner,
  selectedFurniture,
  onSelectFurniture 
}: InteriorSceneProps) {
  const { updateBuilding } = useGameStore();
  const { scene, camera } = useThree();
  const floorRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFurniture, setDraggedFurniture] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useFrame(() => {
    if (isDragging && draggedFurniture && floorRef.current) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(mousePosition.x, mousePosition.y);
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(floorRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const inventory = building.inventory || [];
        const updatedInventory = inventory.map(item => {
          if (item.id === draggedFurniture) {
            return {
              ...item,
              position: { x: point.x, y: point.z }
            };
          }
          return item;
        });

        updateBuilding(building.id, { inventory: updatedInventory });
      }
    }
  });

  const handlePointerMove = (event: THREE.Event) => {
    if (isDragging) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    }
  };

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Éclairage */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />

      {/* Sol */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
        position={[0, 0, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#4a4a4a"
          metalness={0.2}
          roughness={0.8}
        />
        <gridHelper args={[20, 20, "#666666", "#444444"]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Murs */}
      <group>
        {/* Mur Nord */}
        <mesh position={[0, 2, -10]} castShadow>
          <boxGeometry args={[20, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        {/* Mur Sud */}
        <mesh position={[0, 2, 10]} castShadow>
          <boxGeometry args={[20, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        {/* Mur Est */}
        <mesh position={[10, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[20, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        {/* Mur Ouest */}
        <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[20, 4, 0.2]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      </group>

      {/* Meubles */}
      {building.inventory?.map((item) => (
        <FurnitureItem
          key={item.id}
          item={item}
          isSelected={selectedFurniture === item.id}
          isOwner={isOwner}
          onClick={() => onSelectFurniture(item.id)}
          onDragStart={() => {
            if (isOwner) {
              setIsDragging(true);
              setDraggedFurniture(item.id);
            }
          }}
          onDragEnd={() => {
            setIsDragging(false);
            setDraggedFurniture(null);
          }}
        />
      ))}
    </group>
  );
}

function FurnitureItem({ 
  item, 
  isSelected,
  isOwner,
  onClick,
  onDragStart,
  onDragEnd 
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={[item.position.x, 0.5, item.position.y]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={() => isOwner && onDragStart()}
      onPointerUp={() => isOwner && onDragEnd()}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={isSelected ? "#3b82f6" : "#64748b"}
        emissive={isSelected ? "#1d4ed8" : undefined}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}