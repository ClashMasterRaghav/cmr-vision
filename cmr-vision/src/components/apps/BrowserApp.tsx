import React, { useState } from 'react';
import { Box, Html } from '@react-three/drei';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://duckduckgo.com/');
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Check if input is a valid URL
      if (searchInput.match(/^(http|https):\/\//)) {
        setUrl(searchInput);
      } else if (searchInput.match(/^[a-zA-Z0-9]+([-\.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)) {
        setUrl(`https://${searchInput}`);
      } else {
        // Treat as search query
        setUrl(`https://duckduckgo.com/?q=${encodeURIComponent(searchInput)}`);
      }
    }
  };

  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#58b792" />
        <Html
          transform
          distanceFactor={1.17}
          position={[0, 0, 0.06]}
          style={{
            width: '1600px',
            height: '900px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f7f7f7', 
            borderBottom: '1px solid #ddd',
            display: 'flex'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search or enter website name"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#58b792',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Go
              </button>
            </form>
          </div>
          <iframe
            title="Browser"
            src={url}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </Html>
      </Box>
    </group>
  );
};

export default BrowserApp; 