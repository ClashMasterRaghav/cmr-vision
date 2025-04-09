import React, { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

// Standard screen dimensions to match VREnvironment
const SCREEN_WIDTH = 1.0;
const SCREEN_HEIGHT = 0.75;
const SCREEN_DEPTH = 0.05;

const VideoApp: React.FC = () => {
  const { gl } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const shadowRef = useRef<THREE.Mesh>(null);

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
      
      // Update state when video is playing
      videoRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      // Update state when video is paused
      videoRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
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
  
  // Apply subtle shadow animation for depth
  useEffect(() => {
    const animate = () => {
      if (shadowRef.current) {
        shadowRef.current.position.z = -0.06 + Math.sin(Date.now() * 0.001) * 0.01;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  // Control functions for video playback
  const togglePlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Get app size based on screen dimensions
  const getAppSize = () => {
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.8 : 1.0;
    
    return [
      SCREEN_WIDTH * scale, 
      SCREEN_HEIGHT * scale, 
      SCREEN_DEPTH
    ] as [number, number, number];
  };

  const appSize = getAppSize();
  const [width, height, depth] = appSize;

  return (
    <group>
      {/* Shadow layer for depth */}
      <mesh ref={shadowRef} position={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.05, height + 0.05, 0.01]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      
      {videoError ? (
        <Box args={appSize} position={[0, 0, 0]}>
          <meshBasicMaterial color="#000000" />
          <Text 
            position={[0, 0, 0.06]} 
            color="white" 
            fontSize={0.1}
            anchorX="center"
            anchorY="middle"
          >
            Video not available
          </Text>
        </Box>
      ) : (
        <Box args={appSize} position={[0, 0, 0]}>
          <meshBasicMaterial attach="material">
            {textureRef.current && <videoTexture attach="map" args={[videoRef.current!]} />}
          </meshBasicMaterial>
        </Box>
      )}
      
      {/* Title bar with YouTube-like style */}
      <mesh position={[0, height/2 - 0.03, 0.051]}>
        <planeGeometry args={[width, 0.06]} />
        <meshStandardMaterial color="#FF0000" transparent opacity={0.8} />
      </mesh>
      
      {/* Video controls with better styling */}
      <group position={[0, -height/2 + height/18, 0.051]}>
        {/* Controls background */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[width, height/9]} />
          <meshStandardMaterial color="#222222" transparent opacity={0.8} />
        </mesh>
        
        {/* Play/Pause button */}
        <mesh 
          position={[-width/2 + 0.07, 0, 0.001]} 
          onClick={togglePlayback}
        >
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
          {/* Play/Pause icon */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[isPlaying ? 0.02 : 0.025, isPlaying ? 0.025 : 0.025]} />
            <meshBasicMaterial color="#222222" />
          </mesh>
        </mesh>
        
        {/* Mute/Unmute button */}
        <mesh 
          position={[-width/2 + 0.15, 0, 0.001]} 
          onClick={toggleMute}
        >
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
          {/* Volume icon */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[0.02, 0.02]} />
            <meshBasicMaterial color={isMuted ? "#FF5555" : "#222222"} />
          </mesh>
        </mesh>
        
        {/* Progress bar */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[width - 0.4, 0.01]} />
          <meshBasicMaterial color="#555555" />
        </mesh>
      </group>
    </group>
  );
};

export default VideoApp; 