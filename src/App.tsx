import { useEffect } from 'react'
import { Vector3 } from 'three'
import AREnvironment from './components/AREnvironment'
import { useAppStore } from './stores/appStore'
import './App.css'

function App() {
  const { addApp } = useAppStore();

  // Initialize sample apps
  useEffect(() => {
    // Add Video Player app
    addApp({
      type: 'videoPlayer',
      title: 'Video Player',
      position: new Vector3(-1.5, 0, -2),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: false,
      data: {
        videoSrc: '/sample-video.mp4'
      }
    });

    // Add YouTube app
    addApp({
      type: 'youtube',
      title: 'YouTube',
      position: new Vector3(-0.5, 0, -2),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: false,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    });

    // Add Google Maps app
    addApp({
      type: 'googleMaps',
      title: 'Google Maps',
      position: new Vector3(0.5, 0, -2),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: false,
      data: {
        location: 'New York, NY'
      }
    });

    // Add Browser app
    addApp({
      type: 'browser',
      title: 'Web Browser',
      position: new Vector3(1.5, 0, -2),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: false,
      url: 'https://lite.duckduckgo.com'
    });

    // Add GitHub app
    addApp({
      type: 'github',
      title: 'GitHub',
      position: new Vector3(0, 1, -2),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: false,
      url: 'https://github.com'
    });
  }, [addApp]);

  return (
    <div className="app">
      <AREnvironment />
    </div>
  );
}

export default App
