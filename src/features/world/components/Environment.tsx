import { Cloud, Stars } from '@react-three/drei';

export function Environment() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <Cloud
        opacity={0.5}
        speed={0.4}
        width={10}
        depth={1.5}
        segments={20}
        position={[20, 30, 0]}
      />
      <Cloud
        opacity={0.3}
        speed={0.3}
        width={15}
        depth={2}
        segments={20}
        position={[-20, 25, 10]}
      />
    </>
  );
}