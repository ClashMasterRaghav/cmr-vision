import React, { useState } from 'react'
import { Vector3 } from 'three'
import VREnvironment from './components/VREnvironment'
import { useAppStore, AppType } from './stores/appStore'
import { AppIcon } from './utils/IconGenerator'
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

// Simple icon renderer component
const Icon = ({ name }: { name: string }) => {
  return <div className="icon"><AppIcon type={name} size={32} /></div>;
};

const App: React.FC = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const { apps, addApp, removeApp, setActiveApp } = useAppStore();

  const launchApp = (type: AppType) => {
    // Create default data based on app type
    let data = {};
    let title = 'Application';

    switch (type) {
      case 'videoPlayer':
        title = 'Windows Media Player';
        data = { videoSrc: '/videos/sample-video.mp4' };
        break;
      case 'youtube':
        title = 'Video Player';
        data = { videoId: 'dQw4w9WgXcQ' };
        break;
      case 'browser':
        title = 'Internet Explorer';
        data = { url: 'https://www.ecosia.org/' };
        break;
      case 'googleMaps':
        title = 'Google Maps';
        data = {};
        break;
      case 'notepad':
        title = 'Notepad';
        data = { content: '' };
        break;
      case 'paint':
        title = 'Paint';
        data = {};
        break;
      case 'calculator':
        title = 'Calculator';
        data = {};
        break;
    }

    // Get a random spawn position
    const position = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    
        addApp({
          type,
          title,
          position,
          rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      isActive: true,
      data
    });
    
    setShowStartMenu(false);
  };

  const handleAppClick = (id: string) => {
    setActiveApp(id);
    setActiveAppId(id);
  };

  const handleCloseStartMenu = () => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  };

  // Format current time for taskbar
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update the time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container" onClick={handleCloseStartMenu}>
      {/* Desktop Icons */}
      <div className="desktop-icons">
        <div className="desktop-icon" onClick={() => launchApp('browser')}>
          <AppIcon type="browser" size={40} className="icon-img" />
          <div className="icon-text">Internet Explorer</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('videoPlayer')}>
          <AppIcon type="videoPlayer" size={40} className="icon-img" />
          <div className="icon-text">Windows Media Player</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('youtube')}>
          <AppIcon type="youtube" size={40} className="icon-img" />
          <div className="icon-text">Video Player</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('googleMaps')}>
          <AppIcon type="googleMaps" size={40} className="icon-img" />
          <div className="icon-text">Google Maps</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('notepad')}>
          <AppIcon type="notepad" size={40} className="icon-img" />
          <div className="icon-text">Notepad</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('paint')}>
          <AppIcon type="paint" size={40} className="icon-img" />
          <div className="icon-text">Paint</div>
        </div>
        
        <div className="desktop-icon" onClick={() => launchApp('calculator')}>
          <AppIcon type="calculator" size={40} className="icon-img" />
          <div className="icon-text">Calculator</div>
        </div>
        
        <div className="desktop-icon">
          <AppIcon type="myComputer" size={40} className="icon-img" />
          <div className="icon-text">My Computer</div>
        </div>
        
        <div className="desktop-icon">
          <AppIcon type="recycle" size={40} className="icon-img" />
          <div className="icon-text">Recycle Bin</div>
        </div>
      </div>

      {/* Windows XP Environment with app windows */}
      <VREnvironment 
        activeAppId={activeAppId} 
        onWindowClose={removeApp}
        onWindowFocus={handleAppClick}
      />

      {/* Windows XP Taskbar */}
      <div className="xp-taskbar">
        <div 
          className="start-button" 
          onClick={(e) => {
            e.stopPropagation();
            setShowStartMenu(!showStartMenu);
          }}
        >
          <AppIcon type="startButton" size={24} />
          <span>Start</span>
        </div>
        
        <div className="taskbar-apps">
          {apps.map(app => (
            <div 
              key={app.id}
              className={`taskbar-app ${app.id === activeAppId ? 'active' : ''}`}
              onClick={() => handleAppClick(app.id)}
            >
              <AppIcon type={app.type} size={16} className="taskbar-app-icon" />
              <span>{app.title}</span>
            </div>
          ))}
        </div>
        
        <div className="taskbar-time">
          {currentTime}
        </div>
      </div>

      {/* Windows XP Start Menu */}
      {showStartMenu && (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-header">
            <img src="https://i.imgur.com/UxQ7HJZ.png" alt="User" />
            <span>User</span>
          </div>
          
          <div className="start-menu-items">
            <div className="start-menu-left">
              <div className="start-menu-item" onClick={() => launchApp('browser')}>
                <AppIcon type="browser" size={32} />
                <span>Internet Explorer</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('videoPlayer')}>
                <AppIcon type="videoPlayer" size={32} />
                <span>Windows Media Player</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('youtube')}>
                <AppIcon type="youtube" size={32} />
                <span>Video Player</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('googleMaps')}>
                <AppIcon type="googleMaps" size={32} />
                <span>Google Maps</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('notepad')}>
                <AppIcon type="notepad" size={32} />
                <span>Notepad</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('paint')}>
                <AppIcon type="paint" size={32} />
                <span>Paint</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('calculator')}>
                <AppIcon type="calculator" size={32} />
                <span>Calculator</span>
              </div>
              
              <div className="start-menu-separator" />
              
              <div className="start-menu-item">
                <AppIcon type="myComputer" size={32} />
                <span>My Computer</span>
              </div>
              
              <div className="start-menu-item">
                <AppIcon type="recycle" size={32} />
                <span>Recycle Bin</span>
              </div>
            </div>
            
            <div className="start-menu-right">
              <div className="start-menu-item">
                <img src="https://i.imgur.com/QMq4ItN.png" alt="Control Panel" />
                <span>Control Panel</span>
              </div>
              
              <div className="start-menu-item">
                <img src="https://i.imgur.com/tSGT3Yi.png" alt="Help" />
                <span>Help and Support</span>
              </div>
              
              <div className="start-menu-separator" />
              
              <div className="start-menu-item">
                <img src="https://i.imgur.com/RBBaQzk.png" alt="Log Off" />
                <span>Log Off</span>
      </div>
      
              <div className="start-menu-item">
                <img src="https://i.imgur.com/FW2eW4L.png" alt="Shut Down" />
                <span>Turn Off Computer</span>
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default App
