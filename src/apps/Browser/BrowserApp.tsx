import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { AppWindow } from '../../stores/appStore';

interface BrowserProps {
  app: AppWindow;
}

const BrowserApp = ({ app }: BrowserProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState(app.url || 'https://lite.duckduckgo.com');
  const [inputUrl, setInputUrl] = useState(url);
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setIsLoaded(true);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newUrl = inputUrl;
    
    // Add https:// if not present
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }
    
    setUrl(newUrl);
  };

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial color="#ffffff" opacity={isLoaded ? 0 : 1} transparent />
      
      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0.01]}
        portal={{ current: gl.domElement.parentNode as HTMLElement }}
        scale={[0.09, 0.09, 0.09]}
        zIndexRange={[16777271, 16777272]}
      >
        <div style={{ width: '560px', height: '315px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '5px', backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '5px', 
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px'
                }}
              />
              <button 
                type="submit"
                style={{
                  marginLeft: '5px',
                  padding: '5px 10px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Go
              </button>
            </form>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <iframe
              ref={iframeRef}
              src={url}
              title="Browser"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default BrowserApp; 