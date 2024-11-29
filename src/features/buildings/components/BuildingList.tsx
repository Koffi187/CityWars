import { Box } from '@react-three/drei';
import { useGameStore } from '../../../store/gameStore';
import { Building } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';

export function BuildingList() {
  const buildings = useGameStore((state) => state.buildings);

  return (
    <group>
      {buildings.map((building: Building) => (
        <BuildingModel key={building.id} building={building} />
      ))}
    </group>
  );
}

function BuildingModel({ building }: { building: Building }) {
  const config = BUILDING_CONFIGS[building.type];
  
  return (
    <Box
      position={[building.x, config.dimensions.height / 2, building.z]}
      args={[
        config.dimensions.width,
        config.dimensions.height,
        config.dimensions.depth
      ]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={config.color}
        metalness={0.2}
        roughness={0.8}
      />
    </Box>
  );
}