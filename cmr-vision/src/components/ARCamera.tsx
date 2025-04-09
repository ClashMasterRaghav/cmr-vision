import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ARCamera: React.FC = () => {
  const { camera } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Setup camera access for background video
  useEffect(() => {
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.style.position = 'fixed';
      videoRef.current.style.top = '0';
      videoRef.current.style.left = '0';
      videoRef.current.style.width = '100%';
      videoRef.current.style.height = '100%';
      videoRef.current.style.objectFit = 'cover';
      videoRef.current.style.zIndex = '-1';
      document.body.appendChild(videoRef.current);
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        }
      })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      })
      .catch(error => {
        console.error('Error accessing camera', error);
      });
    }

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        document.body.removeChild(videoRef.current);
        videoRef.current = null;
      }
    };
  }, []);

  // Better mobile camera positioning
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Mobile-first camera positioning
      const isMobile = window.innerWidth < 768;
      
      // Position camera for optimal viewing
      camera.position.set(0, 0, isMobile ? 0.5 : 1.0);
      camera.lookAt(0, 0, -1);
      
      // Mobile-optimized FOV
      camera.fov = isMobile ? 80 : 60;
      camera.updateProjectionMatrix();
      
      // Handle window resizing
      const handleResize = () => {
        const newIsMobile = window.innerWidth < 768;
        camera.fov = newIsMobile ? 80 : 60;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.position.z = newIsMobile ? 0.5 : 1.0;
        camera.updateProjectionMatrix();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [camera]);

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 0, window.innerWidth < 768 ? 0.5 : 1.0]} 
      fov={window.innerWidth < 768 ? 80 : 60}
      near={0.1}
      far={1000}
      aspect={window.innerWidth / window.innerHeight}
    />
  );
};

export default ARCamera; 