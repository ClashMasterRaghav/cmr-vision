import React, { useState } from 'react';
import Screen from '../Screen';
import * as THREE from 'three';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://duckduckgo.com/');
  
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <Screen 
      contentUrl={url}
      position={position}
      scale={scale}
    />
  );
};

export default BrowserApp; 