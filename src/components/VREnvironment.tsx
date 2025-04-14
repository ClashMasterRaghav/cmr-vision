import React from 'react';
import { useAppStore, AppType } from '../stores/appStore';
import BrowserApp from '../apps/BrowserApp';
import GoogleMapsApp from '../apps/GoogleMapsApp';
import YouTubeApp from '../apps/YouTubeApp';
import VideoPlayerApp from '../apps/VideoPlayerApp';
import NotepadApp from '../apps/NotepadApp';
import PaintApp from '../apps/PaintApp';
import CalculatorApp from '../apps/CalculatorApp';
import CalendarApp from '../apps/CalendarApp';
import MyComputerApp from '../apps/MyComputerApp';
import RecycleBinApp from '../apps/RecycleBinApp';
import MinesweeperApp from '../apps/MinesweeperApp';
import { getAssetPath } from '../utils/assetUtils';

interface DesktopIcon {
  type: string;
  title: string;
  icon: string;
}

interface VREnvironmentProps {
  activeAppId: string | null;
  onWindowClose: (id: string) => void;
  onWindowFocus: (id: string) => void;
  desktopIcons: DesktopIcon[];
  onLaunchApp: (type: AppType) => void;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({
  activeAppId,
  onWindowClose,
  onWindowFocus,
  desktopIcons,
  onLaunchApp
}) => {
  const { apps } = useAppStore();

  return (
    <div className="vr-environment" style={{zIndex: 1, position: 'relative'}}>
      {/* Desktop Icons */}
      <div className="desktop-icons">
        {desktopIcons.map((icon, index) => (
          <div 
            key={index}
            className="desktop-icon" 
            onClick={() => onLaunchApp(icon.type as AppType)}
          >
            <img src={getAssetPath(icon.icon)} alt={icon.title} className="icon-img" />
            <div className="icon-text">{icon.title}</div>
          </div>
        ))}
      </div>
      
      {/* App Windows */}
      {apps.map(app => {
        const closeApp = () => onWindowClose(app.id);
        
        switch (app.type) {
          case 'browser':
            return (
              <BrowserApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'googleMaps':
            return (
              <GoogleMapsApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'youtube':
            return (
              <YouTubeApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'videoPlayer':
            return (
              <VideoPlayerApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'notepad':
            return (
              <NotepadApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );

          case 'paint':
            return (
              <PaintApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );

          case 'calculator':
            return (
              <CalculatorApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'calendar':
            return (
              <CalendarApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'myComputer':
            return (
              <MyComputerApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
            
          case 'recycleBin':
            return (
              <RecycleBinApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          case 'minesweeper':
            return (
              <MinesweeperApp
                key={app.id}
                id={app.id}
                title={app.title}
                onClose={closeApp}
                data={app.data}
              />
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default VREnvironment;
