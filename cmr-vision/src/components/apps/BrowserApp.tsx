import React, { useState, useRef, useEffect } from 'react';
import { Box, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://duckduckgo.com/');
  const [searchInput, setSearchInput] = useState('');
  const { size } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Scale factor for the iframe - increased for better mobile visibility 
  const scaleFactor = 1.3;
  
  // Calculate iframe dimensions based on the canvas size
  const width = Math.min(800, size.width * 0.8);
  const height = width * (9/16); // 16:9 aspect ratio

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
    if (window.innerWidth < 768) {
      return [2.5, 2.5 / (16/9), 0.05] as [number, number, number];
    }
    return [3.5, 3.5 / (16/9), 0.05] as [number, number, number];
  };

  const appSize = getAppSize();

  return (
    <group>
      <Box args={appSize} position={[0, 0, 0]}>
        <meshStandardMaterial color="#58b792" />
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
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            pointerEvents: 'auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
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
    </group>
  );
};

export default BrowserApp; 