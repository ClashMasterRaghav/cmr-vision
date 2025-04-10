import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { AppWindow } from '../../stores/appStore';
import * as THREE from 'three';

interface VideoPlayerProps {
  app: AppWindow;
}

const VideoPlayerApp = ({ app }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Initialize video texture
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    
    videoTextureRef.current = videoTexture;
    
    if (materialRef.current) {
      materialRef.current.map = videoTexture;
      materialRef.current.needsUpdate = true;
    }
    
    // Clean up
    return () => {
      videoTexture.dispose();
    };
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setPlaying(!playing);
  };

  return (
    <>
      {/* Invisible video element for playback */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        src={app.data?.videoSrc || "/sample-video.mp4"}
        loop
        playsInline
        crossOrigin="anonymous"
      />
      
      {/* Video display plane */}
      <mesh position={[0, 0, 0.01]} onClick={togglePlay}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshBasicMaterial 
          ref={materialRef} 
          toneMapped={false}
        />
      </mesh>
      
      {/* Play/Pause button */}
      <mesh position={[0, -0.25, 0.02]} onClick={togglePlay}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshBasicMaterial color="#4b5563" />
      </mesh>
    </>
  );
};

export default VideoPlayerApp; 