import React, { useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const GithubApp: React.FC = () => {
  const { size } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Scale factor for the iframe - adjust as needed
  const scaleFactor = 0.95;
  
  // Calculate iframe dimensions based on the canvas size
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

  // Check if running in Electron to handle browser differently
  const isElectron = () => {
    return typeof window !== 'undefined' && 
           window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  };

  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#24292e" />
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
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            pointerEvents: 'auto',
          }}
        >
          {isElectron() ? (
            <webview 
              src="https://github.com"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            ></webview>
          ) : (
            <iframe
              ref={iframeRef}
              title="GitHub"
              width={width}
              height={height}
              src="https://github.com"
              frameBorder="0"
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </Html>
      </Box>
    </group>
  );
};

export default GithubApp; 