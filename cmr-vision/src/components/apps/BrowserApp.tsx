import React, { useState, useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Standard screen dimensions to match VREnvironment
const SCREEN_WIDTH = 1.0;
const SCREEN_HEIGHT = 0.75; 

interface BrowserAppProps {
  viewportSize: {
    width: number,
    height: number
  }
}

const BrowserApp: React.FC<BrowserAppProps> = ({ viewportSize }) => {
  const [url, setUrl] = useState('https://duckduckgo.com/');
  const [searchInput, setSearchInput] = useState('');
  const { size } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use the provided viewport size
  const { width: vpWidth, height: vpHeight } = viewportSize;
  
  // Scale factor for the iframe - optimized for readability
  const scaleFactor = 1.5;
  
  // Calculate iframe dimensions based on standard size
  const width = Math.min(800, size.width * 0.8);
  const height = width * (9/16); // 16:9 aspect ratio
  
  // Add shadow to browser frame
  const shadowRef = useRef<THREE.Mesh>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Check if input is a valid URL
      if (searchInput.match(/^(http|https):\/\//)) {
        setUrl(searchInput);
      } else if (searchInput.match(/^[a-zA-Z0-9]+([-\.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)) {
        setUrl(`https://${searchInput}`);
      } else {
        // Treat as search query
        setUrl(`https://duckduckgo.com/?q=${encodeURIComponent(searchInput)}`);
      }
    }
  };

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

  // Get app size based on screen size
  const getAppSize = () => {
    // Mobile optimized smaller size
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.8 : 1.0;
    
    return [
      SCREEN_WIDTH * scale, 
      SCREEN_HEIGHT * scale, 
      0.05
    ] as [number, number, number];
  };

  const appSize = getAppSize();
  
  // Apply subtle animation to the content
  useEffect(() => {
    const animate = () => {
      if (shadowRef.current) {
        shadowRef.current.position.z = -0.06 + Math.sin(Date.now() * 0.001) * 0.01;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <group>
      {/* Browser window background with shadow */}
      <mesh ref={shadowRef} position={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[appSize[0] + 0.05, appSize[1] + 0.05, 0.01]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      
      {/* Main box with appealing color */}
      <Box args={appSize} position={[0, 0, 0]}>
        <meshStandardMaterial color="#58b792" />
        <Html
          transform
          distanceFactor={12}
          position={[0, 0, 0.06]}
          scale={[0.025 * scaleFactor, 0.025 * scaleFactor, 0.025]}
          occlude
          zIndexRange={[1, 10]}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            pointerEvents: 'auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ 
            padding: '6px', 
            backgroundColor: '#f7f7f7', 
            borderBottom: '1px solid #ddd',
            display: 'flex'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search or enter website name"
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '13px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: '6px',
                  padding: '4px 8px',
                  backgroundColor: '#58b792',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Go
              </button>
            </form>
          </div>
          {isElectron() ? (
            <webview 
              src={url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                flex: 1,
              }}
            ></webview>
          ) : (
            <iframe
              ref={iframeRef}
              title="Browser"
              src={url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                flex: 1,
                backgroundColor: 'white'
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </Html>
      </Box>
      
      {/* Title bar with styles similar to sample code */}
      <mesh position={[0, appSize[1]/2 - 0.03, 0.051]}>
        <planeGeometry args={[appSize[0], 0.06]} />
        <meshStandardMaterial color="#444444" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export default BrowserApp; 