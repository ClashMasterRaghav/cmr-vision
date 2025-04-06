import React from 'react';
import { Box, Html } from '@react-three/drei';
import * as THREE from 'three';

const GithubApp: React.FC = () => {
  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#24292e" />
        <Html
          transform
          distanceFactor={1.17}
          position={[0, 0, 0.06]}
          style={{
            width: '1600px',
            height: '900px',
            backgroundColor: 'white',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            title="GitHub"
            width="1600"
            height="900"
            src="https://github.com"
            frameBorder="0"
            style={{ width: '100%', height: '100%' }}
          />
        </Html>
      </Box>
    </group>
  );
};

export default GithubApp; 