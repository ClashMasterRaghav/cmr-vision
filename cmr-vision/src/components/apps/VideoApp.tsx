import React, { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const VideoApp: React.FC = () => {
  const { gl } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Create video element
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.src = '/assets/ar_Tek_It.mp4'; // Path relative to public folder
      videoRef.current.crossOrigin = 'anonymous';
      videoRef.current.loop = true;
      videoRef.current.muted = true; // Muted to allow autoplay
      videoRef.current.style.display = 'none';
      document.body.appendChild(videoRef.current);
      
      // Create video texture
      textureRef.current = new THREE.VideoTexture(videoRef.current);
      textureRef.current.minFilter = THREE.LinearFilter;
      textureRef.current.magFilter = THREE.LinearFilter;
      textureRef.current.format = THREE.RGBAFormat;
      
      // Play video
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        setVideoError(true);
      });
      
      // Add error handler for video loading errors
      videoRef.current.addEventListener('error', () => {
        console.error("Error loading video");
        setVideoError(true);
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        document.body.removeChild(videoRef.current);
        videoRef.current = null;
      }
      
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [gl]);

  return (
    <group>
      {videoError ? (
        <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#000000" />
          <Text 
            position={[0, 0, 0.06]} 
            color="white" 
            fontSize={0.5}
            anchorX="center"
            anchorY="middle"
          >
            Video not available
          </Text>
        </Box>
      ) : (
        <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
          <meshBasicMaterial attach="material">
            {textureRef.current && <videoTexture attach="map" args={[videoRef.current!]} />}
          </meshBasicMaterial>
        </Box>
      )}
      
      {/* Video controls */}
      <Box args={[16, 1, 0.1]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#222222" />
      </Box>
    </group>
  );
};

export default VideoApp; 