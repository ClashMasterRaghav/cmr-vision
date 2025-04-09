import React, { useRef, useEffect } from 'react';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Standard screen dimensions (16:9 aspect ratio)
  const width = 16;
  const height = 9;
  
  // Setup iframe interaction handler
  useEffect(() => {
    const handleIframeInteraction = () => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };
    
    document.addEventListener('click', handleIframeInteraction);
    return () => {
      document.removeEventListener('click', handleIframeInteraction);
    };
  }, []);
  
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
            width: `${1600}px`, // Fixed width for consistent website rendering
            height: `${900}px`, // 16:9 aspect ratio
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <iframe
            ref={iframeRef}
            title="Screen Content"
            src={contentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Html>
      </Box>
    </group>
  );
};

export default Screen; 