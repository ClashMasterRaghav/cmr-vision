import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface MapAppProps {
  viewportSize: {
    width: number,
    height: number
  }
}

const MapApp: React.FC<MapAppProps> = ({ viewportSize }) => {
  const mapRef = useRef<THREE.Mesh>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null);
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [zoom, setZoom] = useState(12);
  
  // Calculate dimensions that use the full viewport while maintaining aspect ratio
  const { width, height } = viewportSize;
  
  // Load map texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${location.lng},${location.lat},${zoom},0/1200x900?access_token=YOUR_MAPBOX_TOKEN`;
    
    // Replace with placeholder texture for development
    const placeholderUrl = '/assets/map-placeholder.jpg';
    
    loader.load(
      placeholderUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        setMapTexture(texture);
        setMapLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading map texture:', error);
      }
    );
    
    return () => {
      if (mapTexture) {
        mapTexture.dispose();
      }
    };
  }, [location, zoom]);
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 18));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 1));
  };
  
  return (
    <group>
      {/* Map display */}
      <mesh ref={mapRef}>
        <planeGeometry args={[width, height]} />
        {mapLoaded ? (
          <meshBasicMaterial map={mapTexture} />
        ) : (
          <meshBasicMaterial color="#c1d3e5" />
        )}
      </mesh>
      
      {/* Map UI Controls */}
      <group position={[width/2 - 0.1, 0, 0.01]}>
        {/* Zoom controls */}
        <group position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
          {/* Zoom in button */}
          <mesh position={[0, 0.15, 0]} onClick={handleZoomIn}>
            <planeGeometry args={[0.08, 0.08]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[0.04, 0.01]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[0.01, 0.04]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
          </mesh>
          
          {/* Zoom out button */}
          <mesh position={[0, 0.05, 0]} onClick={handleZoomOut}>
            <planeGeometry args={[0.08, 0.08]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[0.04, 0.01]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
          </mesh>
        </group>
      </group>
      
      {/* Map title bar */}
      <mesh position={[0, height/2 - 0.05, 0.01]}>
        <planeGeometry args={[width, 0.1]} />
        <meshBasicMaterial color="#3B5998" transparent opacity={0.8} />
        <Text 
          position={[0, 0, 0.001]} 
          fontSize={0.04}
          color="#FFFFFF"
        >
          Map View
        </Text>
      </mesh>
      
      {/* Location search bar (placeholder) */}
      <mesh position={[0, -height/2 + 0.08, 0.01]}>
        <planeGeometry args={[width - 0.2, 0.08]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export default MapApp; 