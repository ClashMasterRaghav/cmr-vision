import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { AppType } from '../App';
import VideoApp from './apps/VideoApp';
import YoutubeApp from './apps/YoutubeApp';
import GithubApp from './apps/GithubApp';
import MapsApp from './apps/MapsApp';
import BrowserApp from './apps/BrowserApp';
import ARCamera from './ARCamera';
import { useFrame } from '@react-three/fiber';

interface VREnvironmentProps {
  selectedApp: AppType;
}

// Standard screen dimensions like in the sample code
const SCREEN_WIDTH = 1.0;
const SCREEN_HEIGHT = 0.75;
const SCREEN_DEPTH = 0.05;

const VREnvironment: React.FC<VREnvironmentProps> = ({ selectedApp }) => {
  // Track all screens - reference like in sample code
  const [screens, setScreens] = useState<{ id: AppType, position: THREE.Vector3 }[]>([]);
  const appRef = useRef<THREE.Group>(null);
  
  // Calculate app size based on device
  const [appSize, setAppSize] = useState<[number, number, number]>([SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_DEPTH]);
  
  // Define static positions for different types of screens
  const appPositions = {
    video: new THREE.Vector3(0, 0.1, -1.0),     // Center top
    browser: new THREE.Vector3(0, -0.8, -1.0),  // Center bottom
    youtube: new THREE.Vector3(-1.1, 0.1, -1.2), // Left top
    github: new THREE.Vector3(1.1, 0.1, -1.2),  // Right top
    maps: new THREE.Vector3(0, 0, -1.4),        // Slightly back center
    welcome: new THREE.Vector3(0, 0, -1.0)      // Center
  };
  
  // Update app size when screen size changes
  useEffect(() => {
    const updateSize = () => {
      // Get aspect ratio for proper proportions
      const aspectRatio = window.innerWidth / window.innerHeight;
      
      // Mobile detection and sizing
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.6 : 1.0;
      
      // Maintain proper aspect ratio for our screens
      setAppSize([
        SCREEN_WIDTH * scale, 
        SCREEN_HEIGHT * scale, 
        SCREEN_DEPTH
      ]);
      
      // Update screen arrangement based on device
      if (isMobile) {
        // Vertical stacking for mobile
        appPositions.video.set(0, 0.8, -1.0);
        appPositions.browser.set(0, -0.8, -1.0);
        appPositions.youtube.set(0, 0.8, -1.0);
        appPositions.github.set(0, 0.8, -1.0);
        appPositions.maps.set(0, 0.8, -1.0);
        appPositions.welcome.set(0, 0, -1.0);
      } else {
        // Circular arrangement for desktop/larger screens
        appPositions.video.set(0, 0.5, -1.0);
        appPositions.browser.set(0, -0.5, -1.0);
        appPositions.youtube.set(-1.0, 0, -1.2);
        appPositions.github.set(1.0, 0, -1.2);
        appPositions.maps.set(0, 0, -1.4);
        appPositions.welcome.set(0, 0, -1.0);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Use Three.js animation system instead of DOM manipulation
  useFrame(() => {
    if (appRef.current) {
      // Apply subtle floating animation
      const time = Date.now() * 0.001;
      const yOffset = Math.sin(time * 1.5) * 0.01;
      
      // Update the Y position with the animation
      if (appRef.current.position.y !== undefined) {
        // Check if selectedApp is a valid key in appPositions
        const position = appPositions[selectedApp as keyof typeof appPositions];
        // Use the position's y value or fallback to 0 if not available
        const originalY = position ? position.y : 0;
        appRef.current.position.y = originalY + yOffset;
      }
    }
  });

  // Render the selected app with correct styling and position
  const renderApp = () => {
    if (selectedApp === 'video') {
      return (
        <group 
          ref={appRef}
          position={appPositions.video} 
          userData={{ appType: 'video' }}
        >
          <VideoApp />
        </group>
      );
    }
    if (selectedApp === 'youtube') {
      return (
        <group 
          ref={appRef}
          position={appPositions.youtube} 
          userData={{ appType: 'youtube' }}
        >
          <YoutubeApp />
        </group>
      );
    }
    if (selectedApp === 'github') {
      return (
        <group 
          ref={appRef}
          position={appPositions.github} 
          userData={{ appType: 'github' }}
        >
          <GithubApp />
        </group>
      );
    }
    if (selectedApp === 'maps') {
      return (
        <group 
          ref={appRef}
          position={appPositions.maps} 
          userData={{ appType: 'maps' }}
        >
          <MapsApp />
        </group>
      );
    }
    if (selectedApp === 'browser') {
      return (
        <group 
          ref={appRef}
          position={appPositions.browser} 
          userData={{ appType: 'browser' }}
        >
          <BrowserApp />
        </group>
      );
    }
    
    // Welcome screen when no app is selected
    return (
      <group 
        ref={appRef}
        position={appPositions.welcome} 
        userData={{ appType: 'welcome' }}
      >
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
      
      {/* Environment lighting with stronger intensity */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} castShadow />
      
      {/* Render the selected app with shadow */}
      <group castShadow receiveShadow>
        {renderApp()}
      </group>
    </>
  );
};

export default VREnvironment; 