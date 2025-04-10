import { useEffect, useState } from 'react'
import { Vector3 } from 'three'
import VREnvironment from './components/VREnvironment'
import { useAppStore, AppWindow } from './stores/appStore'
import './App.css'

// Predefined spawn positions for a better layout in the room
const spawnPositions = [
  new Vector3(-3, 1, -6),    // Above desk
  new Vector3(0, 1, -6),     // Above desk center
  new Vector3(3, 0, -4),     // Right side of room
  new Vector3(-6, 0, 0),     // Left wall
  new Vector3(6, 0, 0),      // Right wall
  new Vector3(0, 1, 4),      // Above couch
  new Vector3(-4, 0, 4),     // Left side of couch
];

function App() {
  const { addApp, apps, removeApp } = useAppStore();
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [spawnIndex, setSpawnIndex] = useState(0);

  // Clear all apps function
  const clearAllApps = () => {
    // Clone the array to avoid modification during iteration
    const appsCopy = [...apps];
    appsCopy.forEach(app => removeApp(app.id));
  };

  // Function to add a new app
  const launchApp = (type: AppWindow['type'], title: string) => {
    console.log(`Launching app: ${type} - ${title}`);
    
    // Get next position from the predefined positions
    const position = spawnPositions[spawnIndex % spawnPositions.length];
    
    // Update spawn index for next app
    setSpawnIndex(prevIndex => prevIndex + 1);
    
    // Create app based on type
    switch (type) {
      case 'videoPlayer':
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
          scale: new Vector3(1.5, 1.5, 1.5),
          isActive: false,
          data: { videoSrc: '/videos/sample.mp4' }
        });
        break;
      case 'youtube':
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
          scale: new Vector3(1.5, 1.5, 1.5),
          isActive: false,
          data: { videoId: 'dQw4w9WgXcQ' }
        });
        break;
      case 'googleMaps':
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
          scale: new Vector3(1.5, 1.5, 1.5),
          isActive: false,
          data: { location: { lat: 37.7749, lng: -122.4194 }, zoom: 12 }
        });
        break;
      case 'browser':
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
          scale: new Vector3(1.5, 1.5, 1.5),
          isActive: false,
          data: { url: 'https://threejs.org/' }
        });
        break;
      case 'electron':
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
          scale: new Vector3(1.5, 1.5, 1.5),
          isActive: false,
          data: { repo: 'electron/electron' }
        });
        break;
    }
    
    // Debug log after adding
    console.log(`App added, current apps count: ${apps.length + 1}`);
  };

  useEffect(() => {
    // Debug log current apps whenever they change
    console.log("Current apps:", apps);
  }, [apps]);

  return (
    <div className="app-container">
      <VREnvironment />
      
      {/* App Launcher Bar */}
      <div className="app-launcher">
        <div className="launcher-header" onClick={() => setShowAppLauncher(!showAppLauncher)}>
          <h3>App Launcher {showAppLauncher ? '▼' : '▲'}</h3>
        </div>
        
        {showAppLauncher && (
          <div className="launcher-apps">
            <button onClick={() => launchApp('videoPlayer', 'Video Player')}>
              Video Player
            </button>
            <button onClick={() => launchApp('youtube', 'YouTube')}>
              YouTube
            </button>
            <button onClick={() => launchApp('googleMaps', 'Google Maps')}>
              Google Maps
            </button>
            <button onClick={() => launchApp('browser', 'Browser')}>
              Web Browser
            </button>
            <button onClick={() => launchApp('electron', 'Electron')}>
              Electron
            </button>
            <button 
              onClick={clearAllApps}
              style={{ 
                backgroundColor: '#e74c3c',
                position: 'relative'
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <h1>CMR Vision VR</h1>
        <p>Use the App Launcher to create new windows</p>
        <p>Drag windows by clicking and holding their title bars</p>
        <p>Use mouse wheel to zoom in/out</p>
        <p>Current apps: {apps.length}</p>
      </div>
    </div>
  );
}

export default App
