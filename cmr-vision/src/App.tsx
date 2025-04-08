import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import VREnvironment from './components/VREnvironment';
import AppSelector from './components/AppSelector';

export type AppType = 'video' | 'youtube' | 'github' | 'maps' | 'browser' | null;

function App() {
  const [selectedApp, setSelectedApp] = useState<AppType>(null);
  const [isARSupported, setIsARSupported] = useState<boolean>(false);
  const [isARMode, setIsARMode] = useState<boolean>(false);

  // Check if device supports AR (has orientation and camera)
  useEffect(() => {
    const checkARSupport = () => {
      const hasOrientationSupport = 'DeviceOrientationEvent' in window;
      const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setIsARSupported(hasOrientationSupport && hasCameraSupport);
    };

    checkARSupport();
  }, []);

  // Toggle AR mode
  const toggleARMode = () => {
    if (isARSupported) {
      setIsARMode(!isARMode);
    } else {
      alert('Your device does not support AR features. Please use a device with camera and orientation sensors.');
    }
  };

  return (
    <div className={`App ${isARMode ? 'ar-mode' : ''}`}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <VREnvironment selectedApp={selectedApp} />
      </Canvas>
      
      <div className="ui-overlay">
        <div className="mode-toggle">
          <button 
            className={`mode-button ${isARMode ? 'active' : ''}`} 
            onClick={toggleARMode}
            disabled={!isARSupported}
          >
            {isARMode ? 'Exit AR' : 'Enter AR'}
          </button>
        </div>
        <AppSelector onSelectApp={setSelectedApp} selectedApp={selectedApp} />
      </div>
    </div>
  );
}

export default App;
