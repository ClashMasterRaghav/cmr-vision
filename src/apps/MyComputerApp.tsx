import React from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

interface MyComputerAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    content?: string;
  };
}

const MyComputerApp: React.FC<MyComputerAppProps> = ({ id, title, onClose, data }) => {
  return (
    <AppWindow 
      id={id}
      title={title} 
      onClose={onClose}
    >
      <div className="my-computer-container">
        <div className="my-computer-toolbar">
          <div className="my-computer-menus">
            <button className="my-computer-menu-item">File</button>
            <button className="my-computer-menu-item">Edit</button>
            <button className="my-computer-menu-item">View</button>
            <button className="my-computer-menu-item">Tools</button>
            <button className="my-computer-menu-item">Help</button>
          </div>
          <div className="my-computer-actions">
            <button className="my-computer-action-button">Refresh</button>
          </div>
        </div>
        <div className="my-computer-content">
          <div className="my-computer-folders">
            <div className="my-computer-folder">
              <img src={getAssetPath('images/icons/drive_c.png')} alt="C Drive" width="48" height="48" />
              <div className="my-computer-folder-name">Local Disk (C:)</div>
            </div>
            <div className="my-computer-folder">
              <img src={getAssetPath('images/icons/network.png')} alt="Network" width="48" height="48" />
              <div className="my-computer-folder-name">Network</div>
            </div>
            <div className="my-computer-folder">
              <img src={getAssetPath('images/icons/control_panel.png')} alt="Control Panel" width="48" height="48" />
              <div className="my-computer-folder-name">Control Panel</div>
            </div>
          </div>
        </div>
        <div className="my-computer-status">
          <div>3 items</div>
          <div>Computer</div>
        </div>
      </div>
    </AppWindow>
  );
};

export default MyComputerApp; 