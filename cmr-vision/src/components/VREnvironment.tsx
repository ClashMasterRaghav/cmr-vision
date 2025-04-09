import React, { useState, useEffect, useRef } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { AppType } from '../App';
import VideoApp from './apps/VideoApp';
import YoutubeApp from './apps/YoutubeApp';
import GithubApp from './apps/GithubApp';
import MapsApp from './apps/MapsApp';
import BrowserApp from './apps/BrowserApp';
import Environment from './Environment';
import { ARButton } from './ARButton';

interface VREnvironmentProps {
  selectedApp: AppType;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({ selectedApp }) => {
  // Reference to the active app container
  const appRef = useRef<THREE.Group>(null);
  
  // Track active apps
  const [activeApps, setActiveApps] = useState<AppType[]>([]);
  
  // Store whether we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Track AR mode state
  const [isARMode, setIsARMode] = useState(false);
  
  // Update active apps when selected app changes
  useEffect(() => {
    if (selectedApp && selectedApp !== 'none' && !activeApps.includes(selectedApp)) {
      setActiveApps(prev => [...prev, selectedApp]);
    }
  }, [selectedApp, activeApps]);
  
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
    // Set FOV to 75 for a standard 1x zoom effect
    const fov = 75;
    const z = -2; // Adjusted to match screen position
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
  
  const { gl } = useThree();

  // Initialize AR with ARButton
  useEffect(() => {
    // Create a DOM overlay container that persists in AR mode
    const arOverlay = document.createElement('div');
    arOverlay.style.position = 'absolute';
    arOverlay.style.bottom = '20px';
    arOverlay.style.left = '0';
    arOverlay.style.width = '100%';
    arOverlay.style.zIndex = '1000';
    arOverlay.style.pointerEvents = 'auto';
    document.body.appendChild(arOverlay);
    
    // Configuration for AR session
    const sessionInit = {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.body } // This ensures UI stays visible
    };
    
    // Create and append AR button
    const arButton = ARButton.createButton(gl, sessionInit);
    document.body.appendChild(arButton);

    // Set up AR session event handlers
    gl.xr.addEventListener('sessionstart', () => {
      console.log('AR session started');
      setIsARMode(true);
      
      // Clone the UI overlay into the AR overlay to ensure visibility
      const uiOverlay = document.querySelector('.ui-overlay');
      if (uiOverlay) {
        arOverlay.appendChild(uiOverlay.cloneNode(true));
      }
    });
    
    gl.xr.addEventListener('sessionend', () => {
      console.log('AR session ended');
      setIsARMode(false);
      
      // Clean up cloned UI
      arOverlay.innerHTML = '';
    });

    return () => {
      if (arButton && arButton.parentNode) {
        arButton.parentNode.removeChild(arButton);
      }
      if (arOverlay && arOverlay.parentNode) {
        arOverlay.parentNode.removeChild(arOverlay);
      }
    };
  }, [gl]);
  
  // Close app handler
  const handleCloseApp = (appType: AppType) => {
    setActiveApps(prev => prev.filter(app => app !== appType));
  };
  
  // Render active apps
  const renderApps = () => {
    return (
      <group ref={appRef}>
        {activeApps.map((appType, index) => {
          // Calculate position for each app in a grid or row
          // For simplicity, let's arrange them in a row
          const xOffset = activeApps.length > 1 ? (index - (activeApps.length - 1) / 2) * 15 : 0;
          const position = new THREE.Vector3(xOffset, 0, -2);
          
          return (
            <group key={`app-${index}-${String(appType)}`} position={position} userData={{ appType }}>
              {appType === 'video' && <VideoApp viewportSize={viewport} />}
              {appType === 'youtube' && <YoutubeApp />}
              {appType === 'github' && <GithubApp />}
              {appType === 'maps' && <MapsApp />}
              {appType === 'browser' && <BrowserApp />}
              {appType === 'welcome' && <WelcomeScreen viewportSize={viewport} onClose={() => handleCloseApp('welcome')} />}
              
              {/* Close button for each app */}
              <mesh 
                position={[7, 4, 0.1]} 
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation();
                  handleCloseApp(appType);
                }}
              >
                <planeGeometry args={[0.8, 0.8]} />
                <meshBasicMaterial color="red" transparent opacity={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>
    );
  };
  
  return (
    <>
      {/* Add immersive environment */}
      <Environment />
      
      {/* Multiple app containers */}
      {renderApps()}
    </>
  );
};

// Simple welcome screen when no app is selected
const WelcomeScreen: React.FC<{ 
  viewportSize: { width: number, height: number },
  onClose: () => void 
}> = ({ viewportSize, onClose }) => {
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