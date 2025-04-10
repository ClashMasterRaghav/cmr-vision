import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AppWindow } from '../../stores/appStore';

interface GoogleMapsProps {
  app: AppWindow;
}

const GoogleMapsApp = ({ app }: GoogleMapsProps) => {
  const { gl } = useThree();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // Get location and zoom from app data
  const location = app.data?.location || { lat: 37.7749, lng: -122.4194 };
  const zoom = app.data?.zoom || 12;

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial 
        color={mapError ? "#ff0000" : "#000000"} 
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
          width: '100%', 
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {!mapError ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14946.813870260223!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1621363632219!5m2!1sen!2sus&z=${zoom}`}
              frameBorder="0"
              style={{ 
                border: 'none',
                width: '100%',
                height: '100%' 
              }}
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setMapError(true)}
            ></iframe>
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#f0f0f0', 
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Google Maps cannot be loaded</div>
                <div style={{ marginTop: '8px' }}>Check your internet connection or try again later</div>
              </div>
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
};

export default GoogleMapsApp; 