import React from 'react';
import * as THREE from 'three';
import DraggableScreen from '../DraggableScreen';

const GithubApp: React.FC = () => {
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <DraggableScreen 
      contentUrl="https://github.com"
      position={position}
      scale={scale}
      title="GitHub"
    />
  );
};

export default GithubApp; 