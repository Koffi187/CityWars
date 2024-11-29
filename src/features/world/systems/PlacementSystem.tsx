import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Plane } from '@react-three/drei';
import { useGameStore } from '../../../store/gameStore';
import { BUILDING_CONFIGS } from '../../buildings/configs/buildingConfigs';

export function PlacementSystem() {
  const { raycaster, camera, scene } = useThree();
  const [placementPosition, setPlacementPosition] = useState<[number, number] | null>(null);
  const { selectedBuildingType, addBuilding, resources, updateResources } = useGameStore();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!selectedBuildingType) return;

      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const pos = intersects[0].point;
        // Snap to grid
        const snappedX = Math.round(pos.x / 2) * 2;
        const snappedZ = Math.round(pos.z / 2) * 2;
        setPlacementPosition([snappedX, snappedZ]);
      }
    };

    const handleClick = () => {
      if (!selectedBuildingType || !placementPosition) return;

      const config = BUILDING_CONFIGS[selectedBuildingType];
      const cost = config.cost;

      if (
        resources.money >= cost.money &&
        resources.materials >= cost.materials &&
        resources.energy >= cost.energy
      ) {
        addBuilding({
          type: selectedBuildingType,
          x: placementPosition[0],
          z: placementPosition[1],
          ...config.dimensions,
          color: config.color,
          resources: 0,
        });

        updateResources({
          money: resources.money - cost.money,
          materials: resources.materials - cost.materials,
          energy: resources.energy - cost.energy,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [selectedBuildingType, raycaster, camera, scene, placementPosition]);

  if (!selectedBuildingType || !placementPosition) return null;

  const config = BUILDING_CONFIGS[selectedBuildingType];

  return (
    <Plane
      position={[placementPosition[0], 0.2, placementPosition[1]]}
      args={[config.dimensions.width, config.dimensions.depth]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshBasicMaterial
        color={config.color}
        opacity={0.5}
        transparent
      />
    </Plane>
  );
}