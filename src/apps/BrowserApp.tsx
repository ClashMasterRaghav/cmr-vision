import React, { useState } from 'react';
import AppWindow from '../components/AppWindow';

interface BrowserAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    url: string;
  };
}

const BrowserApp: React.FC<BrowserAppProps> = ({ id, title, onClose, data }) => {
  const [url, setUrl] = useState(data.url);
  const [inputUrl, setInputUrl] = useState(data.url);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add https:// if not present
    let processedUrl = inputUrl;
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }
    
    setIsLoading(true);
    setUrl(processedUrl);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <AppWindow title={title} onClose={onClose}>
      <div className="browser-container">
        <div className="browser-toolbar">
          <form onSubmit={handleNavigate} className="url-form">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="url-input"
              placeholder="Enter URL..."
              autoFocus
            />
            <button type="submit" className="url-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </button>
          </form>
        </div>
        <div className="browser-content">
          {isLoading ? (
            <div className="browser-loading">
              <div className="loader-large"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <iframe
              title={`browser-${id}`}
              src={url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              loading="eager"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
      </div>
    </AppWindow>
  );
};

export default BrowserApp;
