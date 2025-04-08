import React, { useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const MapsApp: React.FC = () => {
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
        <meshStandardMaterial color="#4285F4" />
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
              src="https://www.google.com/maps"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            ></webview>
          ) : (
            <iframe
              ref={iframeRef}
              title="Google Maps"
              width={width}
              height={height}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30578.304813325213!2d-118.26888805!3d34.0536909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e1!3m2!1sen!2sin!4v1666666666666!5m2!1sen!2sin"
              frameBorder="0"
              style={{ 
                width: '100%', 
                height: '100%',
                border: 0 
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </Html>
      </Box>
    </group>
  );
};

export default MapsApp; 