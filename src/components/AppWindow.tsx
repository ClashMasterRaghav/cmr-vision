import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Interactive, Events } from '@react-three/xr';
import { useAppStore, AppWindow as AppWindowType } from '../stores/appStore';
import VideoPlayerApp from '../apps/VideoPlayer/VideoPlayerApp';
import YouTubeApp from '../apps/YouTube/YouTubeApp';
import GoogleMapsApp from '../apps/GoogleMaps/GoogleMapsApp';
import BrowserApp from '../apps/Browser/BrowserApp';
import GitHubApp from '../apps/GitHub/GitHubApp';

interface AppWindowProps {
  app: AppWindowType;
}

const AppWindow = ({ app }: AppWindowProps) => {
  const { setActiveApp } = useAppStore();
  const groupRef = useRef<THREE.Group>(null);
  
  // Handle window selection
  const handleSelect = () => {
    setActiveApp(app.id);
  };

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
      case 'github':
        return <GitHubApp app={app} />;
      default:
        return null;
    }
  };

  return (
    <group 
      ref={groupRef}
      position={[app.position.x, app.position.y, app.position.z]}
      rotation={[app.rotation.x, app.rotation.y, app.rotation.z]}
      scale={[app.scale.x, app.scale.y, app.scale.z]}
    >
      <mesh position={[0, 0, -0.01]} onClick={handleSelect}>
        <planeGeometry args={[1.05, 0.65]} />
        <meshBasicMaterial color={app.isActive ? "#3b82f6" : "#6b7280"} />
      </mesh>
      
      {/* Title bar */}
      <mesh position={[0, 0.3, 0]} onClick={handleSelect}>
        <planeGeometry args={[1, 0.05]} />
        <meshBasicMaterial color={app.isActive ? "#2563eb" : "#4b5563"} />
      </mesh>
      
      {/* App content area */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* App-specific content */}
      {renderAppContent()}
    </group>
  );
};

export default AppWindow; 