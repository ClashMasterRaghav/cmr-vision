import React from 'react';
import { Box, Html } from '@react-three/drei';
import * as THREE from 'three';

const MapsApp: React.FC = () => {
  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4285F4" />
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
            title="Google Maps"
            width="1600"
            height="900"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30578.304813325213!2d-118.26888805!3d34.0536909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e1!3m2!1sen!2sin!4v1666666666666!5m2!1sen!2sin"
            frameBorder="0"
            style={{ 
              width: '100%', 
              height: '100%',
              border: 0 
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Html>
      </Box>
    </group>
  );
};

export default MapsApp; 