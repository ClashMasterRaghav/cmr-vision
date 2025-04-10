import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AppWindow } from '../../stores/appStore';

interface YouTubeProps {
  app: AppWindow;
}

const YouTubeApp = ({ app }: YouTubeProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [youtubeError, setYoutubeError] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  
  // Get videoId from app data
  const videoId = app.data?.videoId || 'dQw4w9WgXcQ';
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        setIsLoaded(true);
        setIsLoadingVideo(false);
      };
      
      iframeRef.current.onerror = () => {
        console.error("Failed to load YouTube video");
        setYoutubeError(true);
        setIsLoadingVideo(false);
      };
      
      // Check if iframe loaded correctly after a timeout
      const timer = setTimeout(() => {
        if (!isLoaded) {
          console.warn("YouTube iframe took too long to load, might be blocked");
          setYoutubeError(true);
          setIsLoadingVideo(false);
        }
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded]);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[2.38, 1.42]} />
      <meshBasicMaterial 
        color="#0f0f0f" 
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: '#0f0f0f'
        }}>
          {/* YouTube App Header */}
          <div style={{ 
            width: '100%',
            height: '56px',
            backgroundColor: '#0f0f0f',
            borderBottom: '1px solid #272727',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 3
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* YouTube Logo */}
              <div style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                marginRight: '24px'
              }}>
                <span style={{
                  backgroundColor: '#ff0000',
                  color: '#fff',
                  width: '28px',
                  height: '20px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '4px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid #fff'
                  }}></span>
                </span>
                YouTube
              </div>
              
              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                maxWidth: '400px'
              }}>
                <input 
                  type="text" 
                  placeholder="Search" 
                  style={{
                    backgroundColor: '#121212',
                    border: '1px solid #303030',
                    color: '#fff',
                    height: '36px',
                    borderRadius: '20px 0 0 20px',
                    padding: '0 16px',
                    flex: 1,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button style={{
                  backgroundColor: '#222222',
                  border: '1px solid #303030',
                  borderLeft: 'none',
                  height: '38px',
                  width: '64px',
                  borderRadius: '0 20px 20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    color: '#aaa',
                    fontSize: '16px'
                  }}>🔍</span>
                </button>
              </div>
            </div>
            
            {/* User Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#303030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '16px'
              }}>🔔</div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1863E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 700
              }}>U</div>
            </div>
          </div>
          
          {/* Content Area */}
          <div style={{
            width: '100%',
            height: 'calc(100% - 56px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {!youtubeError ? (
              <>
                {/* Video Loading Animation */}
                {isLoadingVideo && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0f0f0f',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      borderTop: '3px solid #ff0000',
                      borderRight: '3px solid transparent',
                      animation: 'yt-spin 1s linear infinite'
                    }}></div>
                    <div style={{
                      color: '#aaa',
                      marginTop: '16px',
                      fontSize: '14px'
                    }}>Loading video...</div>
                  </div>
                )}
                
                {/* Actual YouTube Embed */}
                <iframe
                  ref={iframeRef}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&mute=1&controls=1&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ 
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0f0f0f'
                  }}
                ></iframe>
              </>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#0f0f0f', 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
                flexDirection: 'column'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '24px',
                  color: '#ff0000',
                  opacity: 0.7
                }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff0000" strokeWidth="2"/>
                    <path d="M12 8V12" stroke="#ff0000" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#ff0000"/>
                  </svg>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 500,
                  marginBottom: '12px',
                  color: '#fff'
                }}>Video Unavailable</div>
                <div style={{
                  fontSize: '14px',
                  color: '#aaa',
                  maxWidth: '400px',
                  lineHeight: '1.5',
                  marginBottom: '24px'
                }}>
                  This video could not be loaded. This may be due to ad blockers, 
                  network connectivity issues, or content restrictions.
                </div>
                <button 
                  onClick={() => {
                    setYoutubeError(false);
                    setIsLoadingVideo(true);
                  }}
                  style={{
                    backgroundColor: '#ff0000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    fontSize: '16px'
                  }}>↻</span>
                  Try Again
                </button>
                <div style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#717171'
                }}>
                  Video ID: {videoId}
                </div>
              </div>
            )}
          </div>
          
          {/* CSS Animations */}
          <style>
            {`
              @keyframes yt-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </Html>
    </mesh>
  );
};

export default YouTubeApp; 