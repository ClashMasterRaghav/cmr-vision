import React, { useState } from 'react';
import AppWindow from '../AppWindow';
import { getAssetPath } from '../../utils/assetUtils';

interface NotepadProps {
  id?: string; // Optional now since we don't use it directly
  title?: string; // Optional now since we use a computed title
  onClose: () => void;
  data?: {
    content?: string;
  };
}

const Notepad: React.FC<NotepadProps> = ({ onClose, data = {} }) => {
  const [text, setText] = useState<string>(data.content || '');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>('Untitled.txt');
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsSaved(false);
  };
  
  // Save function
  const handleSave = () => {
    // In a real app, this would save to a file system
    // For now we just simulate saving
    console.log(`Saving file ${fileName} with content: ${text}`);
    setIsSaved(true);
  };
  
  // New document
  const handleNew = () => {
    if (!isSaved) {
      if (window.confirm('Do you want to save changes to ' + fileName + '?')) {
        handleSave();
      }
    }
    setText('');
    setFileName('Untitled.txt');
    setIsSaved(true);
  };
  
  // Warn before closing if not saved
  const handleCloseWithCheck = () => {
    if (!isSaved) {
      if (window.confirm('Do you want to save changes to ' + fileName + '?')) {
        handleSave();
      }
    }
    onClose();
  };

  // Update window title based on file name and saved status
  const windowTitle = `${fileName}${!isSaved ? ' *' : ''} - Notepad`;
  
  return (
    <AppWindow
      title={windowTitle}
      onClose={handleCloseWithCheck}
    >
      <div className="notepad-container">
        <div className="notepad-toolbar">
          <div className="notepad-menus">
            <button className="notepad-menu-item">File</button>
            <button className="notepad-menu-item">Edit</button>
            <button className="notepad-menu-item">Format</button>
            <button className="notepad-menu-item">View</button>
            <button className="notepad-menu-item">Help</button>
          </div>
          <div className="notepad-actions">
            <button 
              className="notepad-action-button" 
              onClick={handleNew}
            >
              New
            </button>
            <button 
              className="notepad-action-button" 
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
        
        <div className="notepad-content">
          <textarea 
            className="notepad-textarea"
            value={text}
            onChange={handleTextChange}
            placeholder="Type here..."
            style={{ color: '#000000' }}
          />
        </div>
        
        <div className="notepad-status">
          <div>Lines: {text.split('\n').length}</div>
          <div>Characters: {text.length}</div>
          <div>{isSaved ? 'Saved' : 'Unsaved'}</div>
        </div>
      </div>
    </AppWindow>
  );
};

export default Notepad; 