import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  // Reference to the active app container
  const appRef = useRef<THREE.Group>(null);
  
  // Store whether we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Detect device type and update on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calculate viewport dimensions in 3D space
  const getViewportSize = () => {
    // Calculate how much space is visible at z=-1
    // Based on camera FOV and position
    const fov = isMobile ? 80 : 60;
    const z = -1;
    const height = 2 * Math.tan((fov * Math.PI / 180) / 2) * Math.abs(z);
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    
    return { width, height };
  };
  
  const viewport = getViewportSize();
  
  // Subtle floating animation
  useFrame(({ clock }) => {
    if (appRef.current) {
      const t = clock.getElapsedTime();
      // Very subtle movement - barely noticeable but adds life
      appRef.current.position.y = Math.sin(t * 0.5) * 0.01;
      // Subtle rotation
      appRef.current.rotation.z = Math.sin(t * 0.3) * 0.005;
    }
  });
  
  // Render the currently selected app in fullscreen
  const renderApp = () => {
    // Calculate the position for the app
    // Slight offset to prevent z-fighting with AR camera background
    const position = new THREE.Vector3(0, 0, -1);
    
    // Create a fullscreen container
    const appContainer = (
      <group 
        ref={appRef}
        position={position}
        userData={{ appType: selectedApp }}
      >
        {selectedApp === 'video' && <VideoApp viewportSize={viewport} />}
        {selectedApp === 'youtube' && <YoutubeApp viewportSize={viewport} />}
        {selectedApp === 'github' && <GithubApp viewportSize={viewport} />}
        {selectedApp === 'maps' && <MapsApp viewportSize={viewport} />}
        {selectedApp === 'browser' && <BrowserApp viewportSize={viewport} />}
        {selectedApp === 'welcome' && (
          <WelcomeScreen viewportSize={viewport} />
        )}
      </group>
    );
    
    return appContainer;
  };
  
  return (
    <>
      {/* Camera */}
      <ARCamera />
      
      {/* Environment lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[0, 5, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* App container */}
      {renderApp()}
    </>
  );
};

// Simple welcome screen when no app is selected
const WelcomeScreen: React.FC<{ viewportSize: { width: number, height: number } }> = ({ viewportSize }) => {
  const { width, height } = viewportSize;
  const scale = Math.min(0.9, width / 2);
  
  return (
    <group>
      {/* Background panel */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width * 0.95, height * 0.95]} />
        <meshStandardMaterial color="#001133" />
      </mesh>
      
      {/* Welcome text */}
      <group position={[0, 0.2, 0.01]}>
        <mesh>
          <planeGeometry args={[width * 0.8, height * 0.2]} />
          <meshBasicMaterial transparent opacity={0.7} color="#0066CC" />
        </mesh>
        
        {/* Custom text would be added here - using basic shapes for now */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width * 0.7, height * 0.1]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Logo placeholder */}
      <mesh position={[0, -0.2, 0.01]}>
        <circleGeometry args={[Math.min(width, height) * 0.2, 32]} />
        <meshStandardMaterial color="#3388FF" />
      </mesh>
    </group>
  );
};

export default VREnvironment; 