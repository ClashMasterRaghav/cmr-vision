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
  const frameId = useRef<number>(0);
  
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
  
  // Animate screens slightly like in the sample code
  useEffect(() => {
    const animate = () => {
      if (selectedApp) {
        // Get the reference to the app container's DOM element
        const appContainer = document.getElementById(`app-${selectedApp}`);
        if (appContainer) {
          // Apply subtle floating animation
          const time = Date.now() * 0.001;
          const yOffset = Math.sin(time * 1.5) * 0.01;
          appContainer.style.transform = `translateY(${yOffset}px)`;
        }
      }
      
      frameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(frameId.current);
  }, [selectedApp]);

  // Render the selected app with correct styling and position
  const renderApp = () => {
    if (selectedApp === 'video') {
      return (
        <group position={appPositions.video} id="app-video">
          <VideoApp />
        </group>
      );
    }
    if (selectedApp === 'youtube') {
      return (
        <group position={appPositions.youtube} id="app-youtube">
          <YoutubeApp />
        </group>
      );
    }
    if (selectedApp === 'github') {
      return (
        <group position={appPositions.github} id="app-github">
          <GithubApp />
        </group>
      );
    }
    if (selectedApp === 'maps') {
      return (
        <group position={appPositions.maps} id="app-maps">
          <MapsApp />
        </group>
      );
    }
    if (selectedApp === 'browser') {
      return (
        <group position={appPositions.browser} id="app-browser">
          <BrowserApp />
        </group>
      );
    }
    
    // Welcome screen when no app is selected
    return (
      <group position={appPositions.welcome} id="app-welcome">
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