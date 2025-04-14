import React, { useState, useRef } from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

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
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100); // 100% is default zoom
  const [history, setHistory] = useState<string[]>([data.url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Check if the input is a URL or a search query
  const isValidUrl = (string: string) => {
    try {
      // Add https:// if not present to make URL parsing work
      const urlToCheck = string.includes('://') ? string : 'https://' + string;
      new URL(urlToCheck);
      
      // Additional check for valid TLD - basic validation to catch common TLDs
      const hasValidTLD = /\.(com|org|net|edu|gov|io|co|app|dev|info|biz|xyz|me)($|\/)/i.test(string);
      
      // Simple check for IP addresses
      const isIPAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(string);
      
      return hasValidTLD || isIPAddress;
    } catch (err) {
      return false;
    }
  };
  
  const navigateToUrl = (newUrl: string, updateHistory = true) => {
    setIsLoading(true);
    setUrl(newUrl);
    
    if (updateHistory) {
      // Add the new URL to history, remove any forward history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    
    let processedUrl = inputUrl.trim();
    
    // Check if input is a valid URL or search query
    if (isValidUrl(processedUrl)) {
      // Process as URL
      setIsSearchMode(false);
      
      // Add https:// if not present
      if (!/^https?:\/\//i.test(processedUrl)) {
        processedUrl = 'https://' + processedUrl;
      }
      
      navigateToUrl(processedUrl);
    } else {
      // Process as search query
      setIsSearchMode(true);
      
      // Create Google search URL with the query
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(processedUrl)}&igu=1`;
      navigateToUrl(searchUrl);
    }
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      navigateToUrl(history[newIndex], false);
    }
  };
  
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      navigateToUrl(history[newIndex], false);
    }
  };
  
  // Dynamic title for the browser window
  const windowTitle = isSearchMode 
    ? `Search: ${inputUrl.length > 20 ? inputUrl.substring(0, 20) + '...' : inputUrl}`
    : title;

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 20, 200)); // Max 200%
  };
  
  const zoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 20, 40)); // Min 40%
  };
  
  const resetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <AppWindow id={id} title={windowTitle} onClose={onClose}>
      <div className="browser-container">
        <div className="browser-toolbar" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '4px 8px'
        }}>
          <div className="browser-navigation" style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            <button 
              onClick={goBack} 
              disabled={historyIndex <= 0}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: historyIndex <= 0 ? '#D4D0C8' : '#ECE9D8',
                border: '1px solid #ACA899',
                borderRadius: '2px',
                cursor: historyIndex <= 0 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '4px',
                opacity: historyIndex <= 0 ? 0.5 : 1
              }}
              title="Go Back"
            >
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>‹</span>
            </button>
            <button 
              onClick={goForward} 
              disabled={historyIndex >= history.length - 1}
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: historyIndex >= history.length - 1 ? '#D4D0C8' : '#ECE9D8',
                border: '1px solid #ACA899',
                borderRadius: '2px',
                cursor: historyIndex >= history.length - 1 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: historyIndex >= history.length - 1 ? 0.5 : 1
              }}
              title="Go Forward"
            >
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}>›</span>
            </button>
          </div>
          
          <form onSubmit={handleNavigate} className="url-form" style={{ flex: 1 }}>
            <div className="search-icon">
              <img src={getAssetPath('images/icons/small_search.png')} alt="Search" width="16" height="16" style={{marginLeft: '5px'}}/>
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="url-input"
              placeholder="Search Google or enter URL..."
              autoFocus
            />
            <button type="submit" className="url-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <p style={{fontSize: '12px', fontWeight: 'light', color: '#000000'}}>Go</p>
              )}
            </button>
          </form>
          
          <div className="browser-zoom-controls" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginLeft: '8px',
            gap: '4px'
          }}>
            <button 
              onClick={zoomOut} 
              className="zoom-button"
              style={{
                width: '22px',
                height: '22px',
                backgroundColor: '#ECE9D8',
                border: '1px solid #ACA899',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1EFE2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ECE9D8'}
              title="Zoom Out"
            >
              –
            </button>
            <span style={{ 
              fontSize: '11px', 
              color: '#000',
              minWidth: '40px',
              textAlign: 'center'
            }}>
              {zoomLevel}%
            </span>
            <button 
              onClick={zoomIn} 
              className="zoom-button"
              style={{
                width: '22px',
                height: '22px',
                backgroundColor: '#ECE9D8',
                border: '1px solid #ACA899',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                // fontWeight: 'bold',
                color: '#000'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1EFE2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ECE9D8'}
              title="Zoom In"
            >
              +
            </button>
            <button 
              onClick={resetZoom} 
              className="zoom-button"
              style={{
                padding: '0 4px',
                height: '22px',
                backgroundColor: '#ECE9D8',
                border: '1px solid #ACA899',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '11px',
                color: '#000'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1EFE2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ECE9D8'}
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
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
              style={{ 
                border: 0,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                width: `${100 / (zoomLevel / 100)}%`,
                height: `${100 / (zoomLevel / 100)}%`
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
              loading="eager"
              referrerPolicy="no-referrer"
              onLoad={() => {
                setIsLoading(false);
                // Update input URL to match current URL for regular sites
                if (!isSearchMode && url.startsWith('http')) {
                  try {
                    const parsedUrl = new URL(url);
                    setInputUrl(parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search);
                  } catch (e) {
                    // Keep existing inputUrl on parse error
                  }
                }
              }}
            />
          )}
        </div>
      </div>
    </AppWindow>
  );
};

export default BrowserApp;
