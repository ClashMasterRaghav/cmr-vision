import React from 'react';
import Screen from '../Screen';
import * as THREE from 'three';

const GithubApp: React.FC = () => {
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <Screen 
      contentUrl="https://github.com"
      position={position}
      scale={scale}
    />
  );
};

export default GithubApp; 