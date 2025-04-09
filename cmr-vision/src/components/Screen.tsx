import React from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ScreenProps {
  contentUrl: string;
  position: THREE.Vector3;
  scale: number;
}

const Screen: React.FC<ScreenProps> = ({ contentUrl, position, scale }) => {
  const { viewport } = useThree();
  
  // Standard screen dimensions
  const width = 16;
  const height = 9;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <Box args={[width, height, 0.1]}>
        <meshStandardMaterial color="#333333" />
        <Html
          transform
          distanceFactor={10}
          position={[0, 0, 0.06]}
          scale={[0.025, 0.025, 0.025]}
          occlude
          zIndexRange={[1, 10]}
          style={{
            width: `${viewport.width}px`,
            height: `${viewport.height}px`,
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <iframe
            title="Screen Content"
            src={contentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowFullScreen
          />
        </Html>
      </Box>
    </group>
  );
};

export default Screen; 