import { useRef, useState, useEffect } from 'react';
import { useAppStore, AppWindow as AppWindowType } from '../stores/appStore';
import VideoPlayerApp from '../apps/VideoPlayer/VideoPlayerApp';
import YouTubeApp from '../apps/YouTube/YouTubeApp';
import GoogleMapsApp from '../apps/GoogleMaps/GoogleMapsApp';
import BrowserApp from '../apps/Browser/BrowserApp';
import ElectronApp from '../apps/Electron/ElectronApp';
import * as THREE from 'three';
import { useHelper } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface AppWindowProps {
  app: AppWindowType;
}

const AppWindow = ({ app }: AppWindowProps) => {
  const { setActiveApp, updateAppPosition, removeApp } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverMinimize, setHoverMinimize] = useState(false);
  const [hoverMaximize, setHoverMaximize] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  
  // Animation values
  const [activeTransition, setActiveTransition] = useState(0);
  const [hoverTransition, setHoverTransition] = useState(0);
  const [hoverButtonTransition, setHoverButtonTransition] = useState(0);
  
  // Handle window selection
  const handleSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (dragDistance < 0.05) { // Only select if not dragging significantly
      setActiveApp(app.id);
    }
  };

  // Handle close button click
  const handleClose = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    removeApp(app.id);
  };

  // Manage active status animation
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (app.isActive) {
      timeout = setTimeout(() => {
        setActiveTransition(1);
      }, 0);
    } else {
      setActiveTransition(0);
    }
    return () => clearTimeout(timeout);
  }, [app.isActive]);

  // Start dragging
  const handleDragStart = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragDistance(0);
    
    // Only drag from the title bar area
    const localY = event.point.y - app.position.y;
    if (localY < 0.55 || localY > 0.7) return;
    
    // Disable camera controls during drag
    const controls = (gl.domElement as any).__r3f?.controls;
    if (controls) {
      controls.enabled = false;
    }
    
    setIsDragging(true);
    setIsInteracting(true);
    setActiveApp(app.id);
    
    // Calculate offset between click point and object center
    const intersection = event.point.clone();
    const offset = intersection.sub(app.position);
    setDragOffset(offset);
  };
  
  // Handle dragging motion
  const handleDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !dragOffset) return;
    
    event.stopPropagation();
    
    // Raycaster to get intersection with z-plane at the depth of the app
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const plane = new THREE.Plane(planeNormal, app.position.z);
    
    // Create a ray from the camera through the mouse point
    const raycaster = new THREE.Raycaster();
    const point2D = new THREE.Vector2(
      (event.nativeEvent.clientX / window.innerWidth) * 2 - 1,
      -(event.nativeEvent.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(point2D, camera);
    
    // Find intersection with our z-plane
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    
    // Update position, subtracting the original offset
    if (intersection) {
      const newPosition = intersection.clone().sub(dragOffset);
      
      // Calculate drag distance for click vs. drag detection
      const dragDelta = new THREE.Vector3()
        .subVectors(newPosition, app.position)
        .length();
      setDragDistance(prev => prev + dragDelta);
      
      updateAppPosition(app.id, newPosition);
    }
  };
  
  // End dragging
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(null);
      
      // Re-enable camera controls
      const controls = (gl.domElement as any).__r3f?.controls;
      if (controls) {
        controls.enabled = true;
      }
      
      // Reset interaction state after a delay
      setTimeout(() => {
        setIsInteracting(false);
      }, 100);
    }
  };
  
  // Smooth animations
  useFrame((state, delta) => {
    // Smooth transitions for active state
    if (app.isActive && hoverTransition < 1) {
      setHoverTransition(Math.min(hoverTransition + delta * 5, 1));
    } else if (!app.isActive && hoverTransition > 0) {
      setHoverTransition(Math.max(hoverTransition - delta * 5, 0));
    }
    
    // Smooth hover effect on buttons
    if ((hoverClose || hoverMinimize || hoverMaximize) && hoverButtonTransition < 1) {
      setHoverButtonTransition(Math.min(hoverButtonTransition + delta * 8, 1));
    } else if (!(hoverClose || hoverMinimize || hoverMaximize) && hoverButtonTransition > 0) {
      setHoverButtonTransition(Math.max(hoverButtonTransition - delta * 8, 0));
    }
    
    // Update position during dragging
    if (isDragging && dragOffset && groupRef.current) {
      groupRef.current.position.copy(app.position);
    }
  });

  // Render the appropriate app component based on type
  const renderAppContent = () => {
    switch (app.type) {
      case 'videoPlayer':
        return <VideoPlayerApp app={app} />;
      case 'youtube':
        return <YouTubeApp app={app} />;
      case 'googleMaps':
        return <GoogleMapsApp app={app} />;
      case 'browser':
        return <BrowserApp app={app} />;
      case 'electron':
        return <ElectronApp app={app} />;
      default:
        return null;
    }
  };

  // Dynamic colors and styles based on active state
  const frameColor = new THREE.Color(
    hoverTransition > 0.5 ? "#2c74b3" : "#1e3a5a"
  ).lerp(
    new THREE.Color(hoverTransition > 0.5 ? "#3787d0" : "#25496e"), 
    hoverTransition
  );
  
  const titleBarColor = new THREE.Color(
    hoverTransition > 0.5 ? "#3787d0" : "#25496e"
  ).lerp(
    new THREE.Color(hoverTransition > 0.5 ? "#4294d9" : "#2c5782"), 
    hoverTransition
  );

  return (
    <group
      ref={groupRef}
      position={app.position}
      rotation={[app.rotation.x, app.rotation.y, app.rotation.z]}
      scale={app.scale}
      onClick={handleSelect}
      onPointerDown={handleDragStart}
      onPointerMove={handleDrag}
      onPointerUp={handleDragEnd}
      onPointerLeave={handleDragEnd}
    >
      {/* Background blur effect for active window */}
      {app.isActive && (
        <mesh position={[0, 0, -0.03]} receiveShadow>
          <planeGeometry args={[2.6, 1.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
        </mesh>
      )}

      {/* Window frame with modern rounded corners */}
      <group>
        {/* Background panel with depth effect */}
        <mesh position={[0, 0, -0.01]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 1.7, 0.02]} />
          <meshPhysicalMaterial 
            color={frameColor}
            roughness={0.15} 
            metalness={0.8}
            clearcoat={0.3}
            clearcoatRoughness={0.3}
            reflectivity={1}
          />
        </mesh>
        
        {/* Main content area with depth */}
        <mesh position={[0, -0.12, 0]} renderOrder={1}>
          <boxGeometry args={[2.4, 1.44, 0.02]} />
          <meshPhysicalMaterial 
            color="#f5f5f7" 
            roughness={0.05}
            metalness={0.2}
            clearcoat={0.1}
            transparent
            opacity={1} // Ensures no transparency issues between apps
            depthWrite={true} // Prevents seeing through to other apps
          />
        </mesh>
        
        {/* Title bar with subtle gradient */}
        <mesh position={[0, 0.7, 0.01]} renderOrder={2}>
          <boxGeometry args={[2.5, 0.3, 0.01]} />
          <meshPhysicalMaterial 
            color={titleBarColor} 
            roughness={0.2} 
            metalness={0.6}
            clearcoat={0.4}
          />
        </mesh>
        
        {/* App title using HTML */}
        <group position={[0, 0.7, 0.025]}>
          <mesh>
            <planeGeometry args={[2, 0.2]} />
            <meshBasicMaterial transparent opacity={0} />
            <Html 
              position={[0, 0, 0.001]}
              center
              style={{
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              {app.title}
            </Html>
          </mesh>
        </group>
        
        {/* Window controls */}
        <group position={[-1.15, 0.7, 0.025]}>
          {/* Close button */}
          <mesh 
            position={[0, 0, 0]} 
            onClick={handleClose}
            onPointerOver={() => setHoverClose(true)}
            onPointerOut={() => setHoverClose(false)}
          >
            <circleGeometry args={[0.07, 32]} />
            <meshStandardMaterial 
              color={hoverClose ? "#ff5a5a" : "#ff3b3b"} 
            />
          </mesh>
          
          {/* X symbol with animation */}
          <group 
            position={[0, 0, 0.001]} 
            rotation={[0, 0, Math.PI/4]} 
            scale={hoverClose ? 0.65 : 0.5}
          >
            <mesh>
              <boxGeometry args={[0.12, 0.02, 0.001]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <boxGeometry args={[0.12, 0.02, 0.001]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        </group>
        
        {/* Minimize button */}
        <group position={[-0.95, 0.7, 0.025]}>
          <mesh
            onPointerOver={() => setHoverMinimize(true)}
            onPointerOut={() => setHoverMinimize(false)}
          >
            <circleGeometry args={[0.07, 32]} />
            <meshStandardMaterial 
              color={hoverMinimize ? "#ffba45" : "#ffaa00"} 
            />
          </mesh>
          
          {/* Minus symbol */}
          <mesh position={[0, 0, 0.001]}>
            <boxGeometry args={[0.08, 0.02, 0.001]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
        
        {/* Maximize button */}
        <group position={[-0.75, 0.7, 0.025]}>
          <mesh
            onPointerOver={() => setHoverMaximize(true)}
            onPointerOut={() => setHoverMaximize(false)}
          >
            <circleGeometry args={[0.07, 32]} />
            <meshStandardMaterial 
              color={hoverMaximize ? "#4ddf65" : "#2bcc43"}
            />
          </mesh>
          
          {/* Square symbol */}
          <mesh position={[0, 0, 0.001]}>
            <boxGeometry args={[0.08, 0.08, 0.001]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      </group>
      
      {/* Content area with proper depth ordering */}
      <group position={[0, -0.12, 0.03]} renderOrder={3}>
        {renderAppContent()}
      </group>
      
      {/* Subtle glass reflection effect */}
      <mesh position={[0, 0, 0.025]} rotation={[0.1, 0, 0]} renderOrder={4}>
        <planeGeometry args={[2.5, 1.7]} />
        <meshPhysicalMaterial 
          transparent 
          opacity={0.03} 
          roughness={0}
          metalness={1}
          clearcoat={1}
          reflectivity={1}
          depthWrite={false}
        />
      </mesh>
      
      {/* Active indicator - subtle glow */}
      {app.isActive && (
        <mesh position={[0, 0, -0.015]} renderOrder={0}>
          <boxGeometry args={[2.54, 1.74, 0.01]} />
          <meshBasicMaterial 
            color="#4a9eff" 
            transparent 
            opacity={0.15} 
          />
        </mesh>
      )}
      
      {/* Drag indicator that appears when hovering over title bar */}
      {isDragging && (
        <mesh position={[0, 0.7, 0.03]} renderOrder={5}>
          <planeGeometry args={[2.5, 0.3]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
};

export default AppWindow; 