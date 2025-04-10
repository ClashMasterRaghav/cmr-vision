import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { AppWindow } from '../../stores/appStore';

interface GitHubProps {
  app: AppWindow;
}

const GitHubApp = ({ app }: GitHubProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default to GitHub home page if no URL provided
  const githubUrl = app.url || 'https://github.com';
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setIsLoaded(true);
    }
  }, []);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial color="#0d1117" opacity={isLoaded ? 0 : 1} transparent />
      
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
            src={githubUrl}
            title="GitHub"
            frameBorder="0"
            style={{ border: 'none', width: '100%', height: '100%' }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        </div>
      </Html>
    </mesh>
  );
};

export default GitHubApp; 