import React, { useState } from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

interface GoogleMapsAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    location?: { lat: number; lng: number };
    zoom?: number;
  };
}

const GoogleMapsApp: React.FC<GoogleMapsAppProps> = ({ id, title, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);
  const defaultLocation = { lat: 23.0225, lng: 72.5714 };
  // Use the location and zoom from data or defaults
  const location = data.location || defaultLocation;
  const zoom = data.zoom || 12;
  
  // Generate the map src URL based on current location or search query
  const getMapSrc = () => {
    // If searching for a location by name
    if (searchQuery && searchQuery.trim() !== '') {
      return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    }
    // If using lat/lng coordinates
    return `https://maps.google.com/maps?q=${location.lat},${location.lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    setIsLoading(true);
    
    // For direct search by name, we're using the query directly in the maps URL
    // Real app would use geocoding API first
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <AppWindow id={id} title={title} onClose={onClose}>
      <div className="maps-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="maps-toolbar" style={{ 
          height: '36px',
          backgroundColor: '#ECE9D8',
          borderBottom: '1px solid #ACA899',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px'
        }}>
          <form onSubmit={handleSearch} className="url-form" style={{ flex: 1 }}>
            <div className="search-icon">
              <img src={getAssetPath('images/icons/small_search.png')} alt="Search" width="16" height="16"  style={{marginLeft: '5px'}}/>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="url-input"
              placeholder="Search locations..."
            />
            <button type="submit" className="url-button" disabled={isLoading}>
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <p style={{fontSize: '12px', fontWeight: 'light', color: '#000000'}}>Go</p>
              )}
            </button>
          </form>
        </div>
        
        {/* Map content */}
        <div className="maps-content" style={{ 
          flex: 1, 
          position: 'relative',
          overflow: 'hidden'
        }}>
          {isLoading && (
            <div className="maps-loading" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              zIndex: 10
            }}>
              <div className="loader-large"></div>
              <p>Loading map...</p>
            </div>
          )}
          
          {error ? (
            <div className="maps-error" style={{
              textAlign: 'center',
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p>Sorry, there was an error loading the map.</p>
              <button onClick={() => window.location.reload()} style={{
                padding: '5px 10px',
                backgroundColor: '#3e95ed',
                color: 'white',
                border: '1px solid #2a7ad4',
                borderRadius: '2px',
                cursor: 'pointer'
              }}>Retry</button>
            </div>
          ) : (
            <iframe
              title={`google-maps-${id}`}
              src={getMapSrc()}
              width="100%"
              height="100%"
              style={{ 
                border: '0',
                display: isLoading ? 'none' : 'block'
              }}
              allowFullScreen
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </div>
        
        {/* Bottom controls and info */}
        <div style={{ 
          padding: '5px 10px', 
          backgroundColor: '#f0f0f0', 
          borderTop: '1px solid #ccc', 
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a 
            href={`https://maps.google.com/?q=${searchQuery || `${location.lat},${location.lng}`}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#1a73e8', textDecoration: 'none' }}
          >
            View larger map
          </a>
        </div>
      </div>
    </AppWindow>
  );
};

export default GoogleMapsApp;
