import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, ARButton, useXR } from '@react-three/xr';
import { useAppStore } from '../stores/appStore';
import AppWindow from './AppWindow';

const ARScene = () => {
  const { apps } = useAppStore();
  const { isPresenting } = useXR();
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      {/* Render all app windows */}
      {apps.map((app) => (
        <AppWindow key={app.id} app={app} />
      ))}
      
      {/* Environment or background */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#111827" opacity={0.8} transparent />
      </mesh>
    </>
  );
};

const AREnvironment = () => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <ARButton 
        sessionInit={{ 
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body } 
        }} 
      />
      <Canvas>
        <XR referenceSpace="local">
          <ARScene />
        </XR>
      </Canvas>
    </div>
  );
};

export default AREnvironment;
