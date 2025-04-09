import React, { useState } from 'react';
import * as THREE from 'three';
import CurvedScreen from '../CurvedScreen';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://duckduckgo.com/');
  
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <CurvedScreen 
      contentUrl={url}
      position={position}
      scale={scale}
      title="Web Browser"
    />
  );
};

export default BrowserApp; 