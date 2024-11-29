import { Box } from '@react-three/drei';
import { useStore } from '../store';

export function Buildings() {
  const buildings = useStore((state) => state.buildings);

  return (
    <group>
      {buildings.map((building) => (
        <Box
          key={building.id}
          position={[building.x, building.height / 2, building.z]}
          args={[building.width, building.height, building.depth]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={building.color} />
        </Box>
      ))}
    </group>
  );
}