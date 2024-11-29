import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { BuildingList } from '../../buildings/components/BuildingList';
import { WorldGrid } from './WorldGrid';
import { PlacementSystem } from '../systems/PlacementSystem';
import { Environment } from './Environment';
import { Terrain } from './Terrain';

export function World() {
  return (
    <Canvas shadows>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
      <Environment />
      <OrbitControls
        maxPolarAngle={Math.PI / 2.5}
        minDistance={10}
        maxDistance={200}
        enablePan={true}
      />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Terrain />
      <WorldGrid />
      <BuildingList />
      <PlacementSystem />
    </Canvas>
  );
}