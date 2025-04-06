import React from 'react';
import { AppType } from '../App';
import '../styles/AppSelector.css';

interface AppSelectorProps {
  onSelectApp: (app: AppType) => void;
  selectedApp: AppType;
}

const AppSelector: React.FC<AppSelectorProps> = ({ onSelectApp, selectedApp }) => {
  const apps: { id: AppType; name: string; icon: string }[] = [
    { id: 'video', name: 'Video Player', icon: '🎬' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'github', name: 'GitHub', icon: '💻' },
    { id: 'maps', name: 'Google Maps', icon: '🗺️' },
    { id: 'browser', name: 'Browser', icon: '🌐' },
  ];

  return (
    <div className="app-selector">
      <div className="app-icons">
        {apps.map((app) => (
          <button
            key={app.id}
            className={`app-icon ${selectedApp === app.id ? 'selected' : ''}`}
            onClick={() => onSelectApp(app.id)}
            title={app.name}
          >
            <span className="icon">{app.icon}</span>
            <span className="name">{app.name}</span>
          </button>
        ))}
      </div>
      {selectedApp && (
        <button className="home-button" onClick={() => onSelectApp(null)}>
          Home
        </button>
      )}
    </div>
  );
};

export default AppSelector; 