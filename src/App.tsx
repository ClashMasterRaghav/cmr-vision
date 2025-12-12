import React, { useState, useEffect } from 'react';
import { Vector3 } from 'three';
import VREnvironment from './components/VREnvironment';
import { useAppStore, AppType } from './stores/appStore';
import { getAssetPath } from './utils/assetUtils';
import './App.css';

// Predefined spawn positions for a better layout in the room
const spawnPositions = [
  new Vector3(50, 50, 0),
  new Vector3(150, 150, 0),
  new Vector3(250, 250, 0),
  new Vector3(350, 150, 0),
  new Vector3(450, 50, 0),
  new Vector3(150, 350, 0),
  new Vector3(250, 450, 0),
];

// Define desktop icons
const desktopIcons = [
  { type: 'myComputer', title: 'My Computer', icon: 'images/icons/my_computer.png' },
  { type: 'recycleBin', title: 'Recycle Bin', icon: 'images/icons/recyclebin.png' },
  { type: 'browser', title: 'Internet Explorer', icon: 'images/icons/internet_explorer.png' },
  { type: 'videoPlayer', title: 'Windows Media Player', icon: 'images/icons/windows_media_player.png' },
  { type: 'youtube', title: 'Video Player', icon: 'images/icons/video_player.png' },
  { type: 'googleMaps', title: 'Google Maps', icon: 'images/icons/search.png' },
  { type: 'notepad', title: 'Notepad', icon: 'images/icons/notepad.png' },
  { type: 'paint', title: 'Paint', icon: 'images/icons/paint.png' },
  { type: 'calculator', title: 'Calculator', icon: 'images/icons/calculator.png' },
  { type: 'calendar', title: 'Calendar', icon: 'images/icons/calender.png' },
  { type: 'minesweeper', title: 'Minesweeper', icon: 'images/icons/minesweeper.png' },
];

const App: React.FC = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const { apps, addApp, removeApp, setActiveApp, toggleMinimize } = useAppStore();
  const activeAppId = apps.find(app => app.isActive)?.id || null;
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isBlueScreenGlitch, setIsBlueScreenGlitch] = useState(false);
  const [isWhiteScreen, setIsWhiteScreen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [shutdownAction, setShutdownAction] = useState<'restart' | 'poweroff' | null>(null);

  // Check if this is a fresh load
  useEffect(() => {
    // First time load, show boot screen
    setIsBooting(true);
    
    // Hide boot screen after 3 seconds
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const launchApp = (type: AppType) => {
    // Create default data based on app type
    let data = {};
    let title = 'Application';

    switch (type) {
      case 'videoPlayer':
        title = 'Windows Media Player';
        // Define available videos
        const availableVideos = [
          { name: 'Tek It', path: 'public/videos/samplevideo1.mp4' },
          { name: 'Crystal Dolphine', path: 'public/videos/samplevideo2.mp4' },
          { name: 'The Old Kanye', path: 'public/videos/samplevideo3.mp4' }
        ];
        
        // Create a video selector function for the video player
        data = { 
          videoSrc: getAssetPath(availableVideos[0].path),
          availableVideos: availableVideos.map(video => ({
            name: video.name,
            path: getAssetPath(video.path)
          }))
        };
        break;
      case 'youtube':
        title = 'Video Player';
        data = { videoId: 'dQw4w9WgXcQ' };
        break;
      case 'browser':
        title = 'Internet Explorer';
        data = { url: 'https://www.indiatvnews.com/' };
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
      case 'calendar':
        title = 'Calendar';
        data = {};
        break;
      case 'myComputer':
        title = 'My Computer';
        data = { content: 'My Computer contents will appear here.' };
        break;
      case 'recycleBin':
        title = 'Recycle Bin';
        data = { content: 'Recycle Bin is empty.' };
        break;
      case 'minesweeper':
        title = 'Minesweeper';
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
    // Check if app is minimized
    const app = apps.find(app => app.id === id);
    if (app?.isMinimized) {
      toggleMinimize(id);
    } else {
    setActiveApp(id);
    }
  };

  const handleCloseStartMenu = () => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  };

  // Format current time for taskbar
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Update the time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to get icon for app type
  const getAppIconPath = (type: AppType): string => {
    const icon = desktopIcons.find(icon => icon.type === type);
    return icon ? getAssetPath(icon.icon) : getAssetPath('images/icons/question_mark.png');
  };

  // Handler for restart functionality
  const handleRestart = () => {
    setShowStartMenu(false);
    setShutdownAction('restart');
    setShowShutdownDialog(true);
  };
  
  // Handler for power off functionality
  const handlePowerOff = () => {
    setShowStartMenu(false);
    setShutdownAction('poweroff');
    setShowShutdownDialog(true);
  };
  
  // Confirm shutdown action
  const confirmShutdown = () => {
    setShowShutdownDialog(false);
    setIsShuttingDown(true);
    
    // Close all apps for both restart and power off
    apps.forEach(app => {
      removeApp(app.id);
    });
    
    if (shutdownAction === 'restart') {
      // Show shutdown screen for 2 seconds, then blue screen, white screen, then boot
      setTimeout(() => {
        // Show blue screen glitch for 300ms
        setIsShuttingDown(false);
        setIsBlueScreenGlitch(true);
        
        setTimeout(() => {
          // Show white screen for 100ms
          setIsBlueScreenGlitch(false);
          setIsWhiteScreen(true);
          
          setTimeout(() => {
            // Show boot screen for 3 seconds
            setIsWhiteScreen(false);
            setIsBooting(true);
            
            setTimeout(() => {
              setIsBooting(false);
            }, 3000);
          }, 100);
        }, 300);
      }, 2000);
    }
  };
  
  // Cancel shutdown
  const cancelShutdown = () => {
    setShowShutdownDialog(false);
    setShutdownAction(null);
  };

  return (
    <div className="app-container" onClick={handleCloseStartMenu}>
      {isShuttingDown && (
        <div className="shutdown-screen">
          <div className="shutdown-logo"></div>
          <div className="shutdown-message">
            {shutdownAction === 'restart' 
              ? "Please wait while your computer restarts..." 
              : "It is now safe to turn off your computer"}
          </div>
          <div className="shutdown-progress">
            <div className="shutdown-progress-blocks">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="shutdown-block"></div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isBlueScreenGlitch && (
        <div className="bluescreen-glitch">
          <div className="bluescreen-text">
            A problem has been detected and Windows has been shut down to prevent damage to your computer.
          </div>
        </div>
      )}
      
      {isWhiteScreen && (
        <div className="white-screen"></div>
      )}
      
      {isBooting && (
        <div className="shutdown-screen">
          <div className="shutdown-logo"></div>
          <div className="shutdown-message">
            Starting Windows...
          </div>
          <div className="shutdown-progress">
            <div className="shutdown-progress-blocks">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="shutdown-block"></div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showShutdownDialog && (
        <div className="xp-dialog-overlay">
          <div className="xp-dialog">
            <div className="xp-dialog-header">
              <div className="xp-dialog-title">
                {shutdownAction === 'restart' ? "Restart Windows" : "Shut Down Windows"}
              </div>
              <button className="xp-dialog-close" onClick={cancelShutdown}>✕</button>
            </div>
            <div className="xp-dialog-content">
              <div className="xp-dialog-icon">
                <img 
                  src={getAssetPath(shutdownAction === 'restart' ? 'images/icons/restart.png' : 'images/icons/poweroff.png')} 
                  alt={shutdownAction === 'restart' ? "Restart" : "Shut Down"} 
                  width="48" 
                  height="48" 
                />
              </div>
              <div className="xp-dialog-message">
                {shutdownAction === 'restart' 
                  ? "Are you sure you want to restart your computer?" 
                  : "Are you sure you want to shut down your computer?"}
              </div>
            </div>
            <div className="xp-dialog-actions">
              <button className="xp-button" onClick={confirmShutdown}>Yes</button>
              <button className="xp-button" onClick={cancelShutdown}>No</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Windows XP Environment with app windows */}
      <VREnvironment 
        activeAppId={activeAppId} 
        onWindowClose={removeApp}
        onWindowFocus={handleAppClick}
        desktopIcons={desktopIcons}
        onLaunchApp={launchApp}
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
          <img src={getAssetPath('images/icons/windows.png')} alt="Start" width="24" height="24" />
          <span>Start</span>
        </div>
        
        <div className="taskbar-apps">
          {apps.map(app => (
            <div 
              key={app.id}
              className={`taskbar-app ${app.id === activeAppId ? 'active' : ''}`}
              onClick={() => handleAppClick(app.id)}
              data-id={app.id}
            >
              <img src={getAppIconPath(app.type)} alt={app.title} />
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
            <img src={getAssetPath('images/icons/profile.png')} alt="User" />
            <span>User</span>
          </div>
          
          <div className="start-menu-items">
            <div className="start-menu-left">
              <div className="start-menu-item" onClick={() => launchApp('myComputer')}>
                <img src={getAssetPath('images/icons/my_computer.png')} alt="My Computer" width="32" height="32" />
                <span>My Computer</span>
              </div>
              
              <div className="start-menu-item" onClick={() => launchApp('recycleBin')}>
                <img src={getAssetPath('images/icons/recyclebin.png')} alt="Recycle Bin" width="32" height="32" />
                <span>Recycle Bin</span>
              </div>
              
              <div className="start-menu-separator" />
              
              {desktopIcons.slice(2).map((icon, index) => (
                <div 
                  key={index}
                  className="start-menu-item" 
                  onClick={() => launchApp(icon.type as AppType)}
                >
                  <img src={getAssetPath(icon.icon)} alt={icon.title} width="32" height="32" />
                  <span>{icon.title}</span>
                </div>
              ))}
            </div>
            
            <div className="start-menu-right">
              <div className="start-menu-item">
                <img src={getAssetPath('images/icons/windows.png')} alt="Control Panel" width="32" height="32" />
                <span>Control Panel</span>
              </div>
              
              <div className="start-menu-item">
                <img src={getAssetPath('images/icons/question_mark.png')} alt="Help" width="32" height="32" />
                <span>Help and Support</span>
              </div>
              
              <div className="start-menu-separator" />
              
              <div className="start-menu-item" onClick={handleRestart}>
                <img src={getAssetPath('images/icons/restart.png')} alt="Restart" width="32" height="32" />
                <span>Restart</span>
              </div>
              
              <div className="start-menu-item" onClick={handlePowerOff}>
                <img src={getAssetPath('images/icons/poweroff.png')} alt="Power Off" width="32" height="32" />
                <span>Power Off</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
