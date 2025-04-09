import React, { useState, useEffect } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { AppType } from '../App';
import VideoApp from './apps/VideoApp';
import YoutubeApp from './apps/YoutubeApp';
import GithubApp from './apps/GithubApp';
import MapsApp from './apps/MapsApp';
import BrowserApp from './apps/BrowserApp';
import ARCamera from './ARCamera';

interface VREnvironmentProps {
  selectedApp: AppType;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({ selectedApp }) => {
  // Calculate app size based on screen aspect ratio - smaller for mobile
  const [appSize, setAppSize] = useState<[number, number, number]>([2, 1.5, 0.05]);
  
  // Update app size when screen size changes
  useEffect(() => {
    const updateSize = () => {
      // Get aspect ratio to maintain proper dimensions
      const aspectRatio = window.innerWidth / window.innerHeight;
      
      // Mobile-optimized smaller width
      const width = window.innerWidth < 768 ? 2.5 : 3;
      const height = width / aspectRatio;
      
      setAppSize([width, height, 0.05]);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Define static fixed positions for each app
  const appPositions = {
    video: new THREE.Vector3(0, 0.8, 0),
    browser: new THREE.Vector3(0, -0.8, 0),
    youtube: new THREE.Vector3(0, 0.8, 0),
    github: new THREE.Vector3(0, 0.8, 0),
    maps: new THREE.Vector3(0, 0.8, 0),
    welcome: new THREE.Vector3(0, 0, 0)
  };

  // Render the selected app
  const renderApp = () => {
    if (selectedApp === 'video') {
      return (
        <group position={appPositions.video}>
          <VideoApp />
        </group>
      );
    }
    if (selectedApp === 'youtube') {
      return (
        <group position={appPositions.youtube}>
          <YoutubeApp />
        </group>
      );
    }
    if (selectedApp === 'github') {
      return (
        <group position={appPositions.github}>
          <GithubApp />
        </group>
      );
    }
    if (selectedApp === 'maps') {
      return (
        <group position={appPositions.maps}>
          <MapsApp />
        </group>
      );
    }
    if (selectedApp === 'browser') {
      return (
        <group position={appPositions.browser}>
          <BrowserApp />
        </group>
      );
    }
    
    // Welcome screen when no app is selected
    return (
      <group position={appPositions.welcome}>
        <Box args={appSize} position={[0, 0, 0]}>
          <meshStandardMaterial color="#007AFF" />
          <mesh position={[0, 0, 0.051]}>
            <planeGeometry args={[appSize[0] * 0.95, appSize[1] * 0.95]} />
            <meshBasicMaterial color="#000000">
              <canvasTexture attach="map" />
            </meshBasicMaterial>
          </mesh>
        </Box>
      </group>
    );
  };

  return (
    <>
      {/* Static camera that looks at the content */}
      <ARCamera />
      
      {/* Environment lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
      
      {/* Render the selected app */}
      {renderApp()}
    </>
  );
};

export default VREnvironment; 