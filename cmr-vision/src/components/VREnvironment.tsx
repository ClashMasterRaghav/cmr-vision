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
import DraggableApp from './DraggableApp';
import { saveAppPositions, loadAppPositions } from '../utils/storage';

interface VREnvironmentProps {
  selectedApp: AppType;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({ selectedApp }) => {
  // Calculate app size based on screen aspect ratio
  const [appSize, setAppSize] = useState<[number, number, number]>([16, 9, 0.1]);
  
  // Update app size when screen size changes
  useEffect(() => {
    const updateSize = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const width = 3.5; // Smaller base width units in 3D space (reduced from 5)
      const height = width / aspectRatio;
      setAppSize([width, height, 0.1]);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Default positions
  const defaultPositions = {
    video: new THREE.Vector3(0, 0, -2),
    youtube: new THREE.Vector3(-2, 0, -2),
    github: new THREE.Vector3(2, 0, -2),
    maps: new THREE.Vector3(0, 1, -3),
    browser: new THREE.Vector3(0, -1, -3),
    welcome: new THREE.Vector3(0, 0, -3)
  };
  
  // Load saved positions from localStorage on component mount
  const [appPositions, setAppPositions] = useState<Record<string, THREE.Vector3>>(() => {
    return loadAppPositions(defaultPositions);
  });

  // Update position for a specific app and save to localStorage
  const handlePositionChange = (app: string, position: THREE.Vector3) => {
    setAppPositions(prev => {
      const newPositions = {
        ...prev,
        [app]: position
      };
      
      // Save to localStorage using utility function
      saveAppPositions(newPositions);
      
      return newPositions;
    });
  };

  // Render the selected app
  const renderApp = () => {
    if (selectedApp === 'video') {
      return (
        <DraggableApp 
          position={appPositions.video}
          size={appSize}
          onPositionChange={(pos) => handlePositionChange('video', pos)}
        >
          <VideoApp />
        </DraggableApp>
      );
    }
    if (selectedApp === 'youtube') {
      return (
        <DraggableApp 
          position={appPositions.youtube}
          size={appSize}
          onPositionChange={(pos) => handlePositionChange('youtube', pos)}
        >
          <YoutubeApp />
        </DraggableApp>
      );
    }
    if (selectedApp === 'github') {
      return (
        <DraggableApp 
          position={appPositions.github}
          size={appSize}
          onPositionChange={(pos) => handlePositionChange('github', pos)}
        >
          <GithubApp />
        </DraggableApp>
      );
    }
    if (selectedApp === 'maps') {
      return (
        <DraggableApp 
          position={appPositions.maps}
          size={appSize}
          onPositionChange={(pos) => handlePositionChange('maps', pos)}
        >
          <MapsApp />
        </DraggableApp>
      );
    }
    if (selectedApp === 'browser') {
      return (
        <DraggableApp 
          position={appPositions.browser}
          size={appSize}
          onPositionChange={(pos) => handlePositionChange('browser', pos)}
        >
          <BrowserApp />
        </DraggableApp>
      );
    }
    
    // Welcome screen when no app is selected
    return (
      <DraggableApp 
        position={appPositions.welcome}
        size={appSize}
        onPositionChange={(pos) => handlePositionChange('welcome', pos)}
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
      </DraggableApp>
    );
  };

  return (
    <>
      {/* AR Camera that follows device orientation */}
      <ARCamera />
      
      {/* Environment lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
      
      {/* Render the selected app */}
      {renderApp()}
    </>
  );
};

export default VREnvironment; 