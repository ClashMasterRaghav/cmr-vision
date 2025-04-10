import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { AppWindow } from '../../stores/appStore';

interface GoogleMapsProps {
  app: AppWindow;
}

const GoogleMapsApp = ({ app }: GoogleMapsProps) => {
  const { gl } = useThree();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default map location if none provided
  const mapLocation = app.data?.location || 'New York, NY';
  const encodedLocation = encodeURIComponent(mapLocation);
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setIsLoaded(true);
    }
  }, []);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial color="#f0f0f0" opacity={isLoaded ? 0 : 1} transparent />
      
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
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedLocation}`}
            title="Google Maps"
            frameBorder="0"
            style={{ border: 'none' }}
            allowFullScreen
          ></iframe>
        </div>
      </Html>
    </mesh>
  );
};

export default GoogleMapsApp; 