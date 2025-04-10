import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AppWindow } from '../../stores/appStore';

interface BrowserProps {
  app: AppWindow;
}

const BrowserApp = ({ app }: BrowserProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [browserError, setBrowserError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);
  
  // Get URL from app data
  const url = app.data?.url || 'https://threejs.org/';
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        setIsLoaded(true);
        setIsNavigating(false);
      };
      
      iframeRef.current.onerror = () => {
        console.error("Failed to load URL:", url);
        setBrowserError(true);
        setIsNavigating(false);
      };
      
      // Check if iframe loaded correctly after a timeout
      const timer = setTimeout(() => {
        if (!isLoaded) {
          console.warn("Browser iframe took too long to load");
          setBrowserError(true);
          setIsNavigating(false);
        }
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded, url]);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[2.38, 1.42]} />
      <meshBasicMaterial 
        color="#f0f2f5" 
        opacity={isLoaded ? 0 : 1} 
        transparent 
      />
      
      <Html
  transform
  distanceFactor={2.38} // Same as plane width
  position={[0, 0, 0.01]}
  portal={{ current: gl.domElement.parentNode as HTMLElement }}
  zIndexRange={[16777271, 16777272]}
>

        <div style={{ 
          width: '1000px', 
          height: '600px', 
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Browser chrome/UI */}
          <div style={{ 
            width: '100%', 
            height: '42px', 
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e1e4e8',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '10px', marginRight: '10px' }}>
              <button style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: '#f1f3f4',
                color: '#5f6368',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ←
              </button>
              <button style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: '#f1f3f4',
                color: '#5f6368',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                →
              </button>
              <button style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: '#f1f3f4',
                color: '#5f6368',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ↻
              </button>
            </div>
            
            {/* URL bar */}
            <div style={{
              flex: 1,
              height: '32px',
              backgroundColor: '#f1f3f4',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              position: 'relative'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isNavigating ? 
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    borderTop: '2px solid #1a73e8',
                    borderRight: '2px solid transparent',
                    animation: 'spin 1s linear infinite'
                  }} /> : 
                  <div style={{
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: browserError ? '#ea4335' : '#1a73e8'
                  }}>
                    {browserError ? '!' : '🔒'}
                  </div>
                }
              </div>
              <input 
                type="text" 
                value={url} 
                readOnly
                style={{
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  color: '#202124',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* Menu buttons */}
            <div style={{ display: 'flex', marginLeft: '10px', gap: '8px' }}>
              <button style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                color: '#5f6368',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ⋮
              </button>
            </div>
          </div>
          
          {/* Content area */}
          <div style={{ 
            position: 'relative',
            height: 'calc(100% - 42px)',
            backgroundColor: '#ffffff' 
          }}>
            {!browserError ? (
              <>
                {/* Loading overlay */}
                {isNavigating && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    zIndex: 2,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '50%',
                      backgroundColor: '#1a73e8',
                      animation: 'loading 2s infinite ease-in-out',
                      transformOrigin: 'left center'
                    }} />
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  width="100%"
                  height="100%"
                  src={url}
                  title="Web Browser"
                  style={{ 
                    border: 'none',
                    backgroundColor: '#ffffff'
                  }}
                  sandbox="allow-same-origin allow-scripts"
                ></iframe>
              </>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#fff', 
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '20px',
                    color: '#ea4335'
                  }}>⚠️</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    marginBottom: '15px',
                    color: '#202124'
                  }}>This page can't be displayed</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#5f6368',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}>
                    The website may be unavailable or you may have connectivity issues.
                    Try checking your network connection or reloading the page.
                  </div>
                  <div style={{ 
                    marginTop: '25px'
                  }}>
                    <button style={{
                      backgroundColor: '#1a73e8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      Reload
                    </button>
                  </div>
                  <div style={{ 
                    marginTop: '15px', 
                    fontSize: '13px', 
                    color: '#80868b' 
                  }}>
                    Attempted URL: {url}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* CSS animations */}
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              @keyframes loading {
                0% { transform: translateX(-100%) scaleX(0.5); }
                50% { transform: translateX(100%) scaleX(0.5); }
                100% { transform: translateX(300%) scaleX(0.5); }
              }
            `}
          </style>
        </div>
      </Html>
    </mesh>
  );
};

export default BrowserApp; 