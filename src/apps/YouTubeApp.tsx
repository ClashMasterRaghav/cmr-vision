import React, { useState } from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

interface YouTubeAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    videoId: string;
  };
}

const YouTubeApp: React.FC<YouTubeAppProps> = ({ id, title, onClose, data }) => {
  const [videoId, setVideoId] = useState(data.videoId);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle YouTube URL or ID input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try to extract video ID from different YouTube URL formats
    let newVideoId = inputValue;
    
    // Match patterns like: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    const watchMatch = inputValue.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/i);
    if (watchMatch) {
      newVideoId = watchMatch[1];
    }
    
    // Match patterns like: https://youtu.be/dQw4w9WgXcQ
    const shortMatch = inputValue.match(/youtu\.be\/([^?&]+)/i);
    if (shortMatch) {
      newVideoId = shortMatch[1];
    }
    
    // Match patterns like: https://www.youtube.com/embed/dQw4w9WgXcQ
    const embedMatch = inputValue.match(/youtube\.com\/embed\/([^?&]+)/i);
    if (embedMatch) {
      newVideoId = embedMatch[1];
    }
    
    if (newVideoId) {
      setIsLoading(true);
      setVideoId(newVideoId);
      setInputValue('');
      
      // Simulate loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };
  
  return (
    <AppWindow id={id} title={title} onClose={onClose}>
      <div className="youtube-container">
        <div className="youtube-toolbar">
          <form onSubmit={handleSubmit} className="url-form">
            <div className="search-icon youtube-icon">
              <img src={getAssetPath('images/icons/small_search.png')} alt="Search" width="16" height="16"  style={{marginLeft: '5px'}}/>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="url-input"
              placeholder="Enter YouTube URL or video ID..."
              autoFocus
            />
            <button type="submit" className="url-button youtube-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <p style={{fontSize: '12px', fontWeight: 'light', color: '#000000'}}>Go</p>
              )}
            </button>
          </form>
        </div>
        <div className="youtube-player">
          {isLoading ? (
            <div className="youtube-loading">
              <div className="loader-large"></div>
              <p>Loading video...</p>
            </div>
          ) : (
            <iframe
              title={`youtube-${id}`}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
      </div>
    </AppWindow>
  );
};

export default YouTubeApp;
