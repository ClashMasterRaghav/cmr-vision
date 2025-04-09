import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import VREnvironment from './components/VREnvironment';
import AppSelector from './components/AppSelector';

export type AppType = 'video' | 'youtube' | 'github' | 'maps' | 'browser' | 'welcome' | null;

function App() {
  const [selectedApp, setSelectedApp] = useState<AppType>(null);
  
  return (
    <div className="App">
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <VREnvironment selectedApp={selectedApp} />
      </Canvas>
      
      <div className="ui-overlay">
        <AppSelector onSelectApp={setSelectedApp} selectedApp={selectedApp} />
      </div>
    </div>
  );
}

export default App;
