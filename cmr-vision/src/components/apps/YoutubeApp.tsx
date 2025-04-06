import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html } from '@react-three/drei';
import * as THREE from 'three';

const YoutubeApp: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = meshRef.current.rotation.y + (hovered ? 0.01 : 0.001);
    }
  });

  return (
    <group>
      <Box
        args={[16, 9, 0.1]}
        position={[0, 0, 0]}
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color="#FF0000" />
        <Html
          transform
          distanceFactor={1.17}
          position={[0, 0, 0.06]}
          style={{
            width: '1600px',
            height: '900px',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            title="YouTube Embed"
            width="1600"
            height="900"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Html>
      </Box>
    </group>
  );
};

export default YoutubeApp; 