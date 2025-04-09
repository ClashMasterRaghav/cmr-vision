import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VideoAppProps {
  viewportSize: {
    width: number,
    height: number
  }
}

const VideoApp: React.FC<VideoAppProps> = ({ viewportSize }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  
  // Calculate aspect-correct dimensions
  const { width, height } = viewportSize;
  const videoAspect = 16/9; // Standard video aspect ratio
  
  // Calculate dimensions that maintain aspect ratio and fill the viewport
  let videoWidth = width * 0.95;
  let videoHeight = videoWidth / videoAspect;
  
  // If video is too tall, scale by height instead
  if (videoHeight > height * 0.95) {
    videoHeight = height * 0.95;
    videoWidth = videoHeight * videoAspect;
  }
  
  // Initialize video element and texture
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Use a sample video file from assets or a placeholder
    const video = videoRef.current;
    video.src = '/assets/sample-video.mp4'; // Update with your actual video path
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    // Create video texture once video metadata is loaded
    video.onloadedmetadata = () => {
      if (!video) return;
      
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      
      videoTextureRef.current = texture;
      setVideoLoaded(true);
    };
    
    // Clean up
    return () => {
      if (videoTextureRef.current) {
        videoTextureRef.current.dispose();
      }
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, []);
  
  // Handle play/pause toggle
  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play()
        .catch(error => console.error('Error playing video:', error));
    }
    
    setPlaying(!playing);
  };
  
  // Update video texture every frame when playing
  useFrame(() => {
    if (playing && videoTextureRef.current && videoRef.current) {
      videoTextureRef.current.needsUpdate = true;
    }
  });
  
  return (
    <group>
      {/* Hidden video element for texture source */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
      />
      
      {/* Video screen with frame */}
      <group>
        {/* Background frame */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[videoWidth + 0.05, videoHeight + 0.05]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Video display surface */}
        <mesh position={[0, 0, 0]} onClick={togglePlayback}>
          <planeGeometry args={[videoWidth, videoHeight]} />
          {videoLoaded ? (
            <meshBasicMaterial map={videoTextureRef.current} />
          ) : (
            <meshBasicMaterial color="#111111" />
          )}
        </mesh>
        
        {/* Play/Pause indicator */}
        {!playing && (
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[videoHeight * 0.2, videoHeight * 0.2]} />
            <meshBasicMaterial transparent opacity={0.7} color="#FFFFFF" />
          </mesh>
        )}
      </group>
      
      {/* Controls */}
      <group position={[0, -videoHeight/2 - 0.05, 0]}>
        {/* Control bar background */}
        <mesh>
          <planeGeometry args={[videoWidth, 0.08]} />
          <meshBasicMaterial transparent opacity={0.5} color="#000000" />
        </mesh>
        
        {/* Play/Pause button */}
        <mesh 
          position={[-videoWidth/2 + 0.08, 0, 0.01]} 
          onClick={togglePlayback}
        >
          <planeGeometry args={[0.06, 0.06]} />
          <meshBasicMaterial color={playing ? "#1E90FF" : "#FFFFFF"} />
        </mesh>
      </group>
    </group>
  );
};

export default VideoApp; 