import React from 'react';
import { useAppStore } from '../stores/appStore';
import BrowserApp from '../apps/BrowserApp';
import GoogleMapsApp from '../apps/GoogleMapsApp';
import YouTubeApp from '../apps/YouTubeApp';
import VideoPlayerApp from '../apps/VideoPlayerApp';
import NotepadApp from '../apps/NotepadApp';
import PaintApp from '../apps/PaintApp';
import CalculatorApp from '../apps/CalculatorApp';

interface VREnvironmentProps {
  activeAppId: string | null;
  onWindowClose: (id: string) => void;
  onWindowFocus: (id: string) => void;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({
  activeAppId,
  onWindowClose,
  onWindowFocus
}) => {
  const { apps } = useAppStore();

  return (
    <div className="vr-environment">
      {apps.map(app => {
        const closeApp = () => onWindowClose(app.id);
        const isActive = app.id === activeAppId;
        
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
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default VREnvironment;
