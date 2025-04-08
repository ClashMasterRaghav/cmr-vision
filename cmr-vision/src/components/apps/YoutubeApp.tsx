import React, { useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const YoutubeApp: React.FC = () => {
  const { size } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Scale factor for the iframe - adjust as needed
  const scaleFactor = 0.95;
  
  // Calculate iframe dimensions based on the canvas size
  // This ensures it's properly sized for interaction
  const width = Math.min(1600, size.width * 0.8);
  const height = width * (9/16); // 16:9 aspect ratio
  
  useEffect(() => {
    // Fix for iOS/Safari that might have issues with iframes in WebGL
    const fixIframeFocus = (e: MouseEvent) => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };
    
    document.addEventListener('click', fixIframeFocus);
    
    return () => {
      document.removeEventListener('click', fixIframeFocus);
    };
  }, []);

  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FF0000" />
        <Html
          transform
          distanceFactor={10}
          position={[0, 0, 0.06]}
          scale={[0.025 * scaleFactor, 0.025 * scaleFactor, 0.025]}
          occlude
          zIndexRange={[1, 10]}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: 'black',
            borderRadius: '10px',
            overflow: 'hidden',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            ref={iframeRef}
            title="YouTube"
            width={width}
            height={height}
            src="https://www.youtube.com/embed/videoseries?list=PLlrxD0HtieHjuPfPDH3CK1OR3FTlgTgV8" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ 
              width: '100%', 
              height: '100%',
              border: 'none'
            }}
          />
        </Html>
      </Box>
    </group>
  );
};

export default YoutubeApp; 