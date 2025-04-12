import React from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

interface RecycleBinAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    content?: string;
  };
}

const RecycleBinApp: React.FC<RecycleBinAppProps> = ({ id, title, onClose, data }) => {
  return (
    <AppWindow 
      id={id}
      title={title} 
      onClose={onClose}
    >
      <div className="recycle-bin-container">
        <div className="recycle-bin-toolbar">
          <div className="recycle-bin-menus">
            <button className="recycle-bin-menu-item">File</button>
            <button className="recycle-bin-menu-item">Edit</button>
            <button className="recycle-bin-menu-item">View</button>
            <button className="recycle-bin-menu-item">Tools</button>
            <button className="recycle-bin-menu-item">Help</button>
          </div>
          <div className="recycle-bin-actions">
            <button className="recycle-bin-action-button" disabled>Empty Recycle Bin</button>
          </div>
        </div>
        <div className="recycle-bin-content">
          <div className="recycle-bin-empty-message">
            <img src={getAssetPath('images/icons/recyclebin_empty2.png')} alt="Empty Recycle Bin" width="64" height="64" />
            <div className="recycle-bin-text">The Recycle Bin is empty</div>
          </div>
        </div>
        <div className="recycle-bin-status">
          <div>0 items</div>
          <div>Recycle Bin</div>
        </div>
      </div>
    </AppWindow>
  );
};

export default RecycleBinApp; 