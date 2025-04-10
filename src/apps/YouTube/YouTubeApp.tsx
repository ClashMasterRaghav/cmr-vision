import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { AppWindow } from '../../stores/appStore';

interface YouTubeProps {
  app: AppWindow;
}

const YouTubeApp = ({ app }: YouTubeProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default YouTube video ID if none provided
  const videoId = app.url?.split('v=')[1] || 'dQw4w9WgXcQ';
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setIsLoaded(true);
    }
  }, []);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial color="#000000" opacity={isLoaded ? 0 : 1} transparent />
      
      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0.01]}
        portal={{ current: gl.domElement.parentNode as HTMLElement }}
        scale={[0.09, 0.09, 0.09]}
        zIndexRange={[16777271, 16777272]}
      >
        <div style={{ width: '560px', height: '315px' }}>
          <iframe
            ref={iframeRef}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </Html>
    </mesh>
  );
};

export default YouTubeApp; 