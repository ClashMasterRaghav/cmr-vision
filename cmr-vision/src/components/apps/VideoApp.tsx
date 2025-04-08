import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

const VideoApp: React.FC = () => {
  const { gl } = useThree();
  const videoRef = useRef<HTMLVideoElement>();
  const textureRef = useRef<THREE.VideoTexture>();

  useEffect(() => {
    // Create video element
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.src = '/sample-video.mp4'; // This should be placed in the public folder
      videoRef.current.crossOrigin = 'anonymous';
      videoRef.current.loop = true;
      videoRef.current.muted = false;
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
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        document.body.removeChild(videoRef.current);
        videoRef.current = undefined;
      }
      
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = undefined;
      }
    };
  }, [gl]);

  return (
    <group>
      <Box args={[16, 9, 0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial attach="material">
          {textureRef.current && <videoTexture attach="map" args={[videoRef.current!]} />}
        </meshBasicMaterial>
      </Box>
      
      {/* Video controls */}
      <Box args={[16, 1, 0.1]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#222222" />
      </Box>
    </group>
  );
};

export default VideoApp; 