import React, { useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree, ThreeEvent } from '@react-three/fiber';
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
  // Similar to the reference image aspect ratio
  const width = 14;
  const height = 7.875;
  
  // Setup iframe interaction handler
  useEffect(() => {
    const handleIframeInteraction = (e: MouseEvent) => {
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
      {/* Thin border/frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[width + 0.05, height + 0.05, 0.02]} />
        <meshStandardMaterial color="#242424" />
      </mesh>
      
      {/* Content surface */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#ffffff" />
        <Html
          transform
          distanceFactor={10}
          position={[0, 0, 0.01]}
          scale={[0.025, 0.025, 0.025]}
          occlude
          zIndexRange={[1, 10]}
          style={{
            width: `${1600}px`,
            height: `${900}px`,
            backgroundColor: 'white',
            borderRadius: '0px', // Sharp corners like the reference image
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
          }}
        >
          {/* URL bar to mimic browser */}
          <div style={{
            height: '30px',
            backgroundColor: '#242424',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            color: 'white',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
          }}>
            <span style={{ marginRight: '10px' }}>⟲</span>
            <span>🔒 {contentUrl}</span>
          </div>
          
          <iframe
            ref={iframeRef}
            title="Screen Content"
            src={contentUrl}
            style={{
              width: '100%',
              height: 'calc(100% - 30px)',
              border: 'none'
            }}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Html>
      </mesh>
    </group>
  );
};

export default Screen; 