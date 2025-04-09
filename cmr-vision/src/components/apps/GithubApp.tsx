import React from 'react';
import * as THREE from 'three';
import CurvedScreen from '../CurvedScreen';

const GithubApp: React.FC = () => {
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <CurvedScreen 
      contentUrl="https://github.com"
      position={position}
      scale={scale}
      title="GitHub"
    />
  );
};

export default GithubApp; 