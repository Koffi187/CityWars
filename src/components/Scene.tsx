import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Grid } from './Grid';
import { Buildings } from './Buildings';
import { Interface } from './Interface';
import { PlacementControls } from './PlacementControls';

export function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [50, 50, 50], fov: 45 }}
        shadows
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[50, 50, 50]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Grid />
        <Buildings />
        <PlacementControls />
        <OrbitControls />
      </Canvas>
      <Interface />
    </div>
  );
}