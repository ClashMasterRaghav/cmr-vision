import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import VREnvironment from './components/VREnvironment';
import AppSelector from './components/AppSelector';

export type AppType = 'video' | 'youtube' | 'github' | 'maps' | 'browser' | 'welcome' | 'none';

function App() {
  const [selectedApp, setSelectedApp] = useState<AppType>('none');
  const [isARActive, setIsARActive] = useState(false);
  
  // Listen for AR session start/end events
  React.useEffect(() => {
    const handleARStart = () => setIsARActive(true);
    const handleAREnd = () => setIsARActive(false);
    
    window.addEventListener('ar-session-start', handleARStart);
    window.addEventListener('ar-session-end', handleAREnd);
    
    return () => {
      window.removeEventListener('ar-session-start', handleARStart);
      window.removeEventListener('ar-session-end', handleAREnd);
    };
  }, []);
  
  return (
    <div className={`App ${isARActive ? 'ar-mode' : ''}`}>
      <Canvas 
        camera={{ 
          fov: 75, 
          position: [0, 0, 0] 
        }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%' 
        }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <VREnvironment selectedApp={selectedApp} />
      </Canvas>
      
      <div className="ui-overlay" style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '0', 
        width: '100%', 
        zIndex: 1000, 
        pointerEvents: 'auto'
      }}>
        <AppSelector onSelectApp={setSelectedApp} selectedApp={selectedApp} />
      </div>
    </div>
  );
}

export default App;
