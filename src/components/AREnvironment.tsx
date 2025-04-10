import { useRef } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { useAppStore } from '../stores/appStore';
import AppWindow from './AppWindow';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Scene component that will be rendered in VR
const VRScene = () => {
  const { apps } = useAppStore();
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      {/* Render all app windows */}
      {apps.map((app) => (
        <AppWindow key={app.id} app={app} />
      ))}
      
      {/* Environment or background */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#0a1929" opacity={0.9} transparent />
      </mesh>

      {/* Add orbit controls for camera movement */}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </>
  );
};

const VREnvironment = () => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <VRScene />
      </Canvas>
    </div>
  );
};

export default VREnvironment;
