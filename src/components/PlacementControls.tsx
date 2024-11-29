import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Plane, Box } from '@react-three/drei';
import { useStore } from '../store';
import { BUILDING_CONFIGS } from '../utils/buildingConfigs';

export function PlacementControls() {
  const { raycaster, camera, scene } = useThree();
  const [placementPosition, setPlacementPosition] = useState<[number, number] | null>(null);
  const { selectedBuildingType, addBuilding, resources, updateResources } = useStore();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!selectedBuildingType) return;

      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([scene.children[0]], true);

      if (intersects.length > 0) {
        const pos = intersects[0].point;
        setPlacementPosition([Math.round(pos.x), Math.round(pos.z)]);
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
    <Box
      position={[placementPosition[0], config.dimensions.height / 2, placementPosition[1]]}
      args={[config.dimensions.width, config.dimensions.height, config.dimensions.depth]}
    >
      <meshStandardMaterial color={config.color} opacity={0.5} transparent />
    </Box>
  );
}