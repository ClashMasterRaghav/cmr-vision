import React from 'react';
import * as THREE from 'three';
import CurvedScreen from '../CurvedScreen';

const YoutubeApp: React.FC = () => {
  // Define the position and scale for the screen
  const position = new THREE.Vector3(0, 0, -2);
  const scale = 1;
  
  return (
    <CurvedScreen 
      contentUrl="https://www.youtube.com/embed/videoseries?list=PLlrxD0HtieHjuPfPDH3CK1OR3FTlgTgV8"
      position={position}
      scale={scale}
      title="YouTube"
    />
  );
};

export default YoutubeApp; 