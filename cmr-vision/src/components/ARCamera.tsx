import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ARCamera: React.FC = () => {
  const { camera } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Setup camera access for background video only
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

  // Set the camera to a fixed position - similar to sample code
  useEffect(() => {
    if (camera && camera instanceof THREE.PerspectiveCamera) {
      // Position directly in front of screens
      camera.position.set(0, 0, 1.5);
      camera.lookAt(0, 0, 0);
      
      // Make camera updates less abrupt
      const smoothlyUpdateCamera = () => {
        if (camera instanceof THREE.PerspectiveCamera) {
          // Calculate aspect ratio
          camera.aspect = window.innerWidth / window.innerHeight;
          
          // Adjust FOV based on device
          const isMobile = window.innerWidth < 768;
          camera.fov = isMobile ? 75 : 65; // Wider FOV on mobile
          
          camera.updateProjectionMatrix();
        }
      };
      
      // Update camera on window resize
      window.addEventListener('resize', smoothlyUpdateCamera);
      smoothlyUpdateCamera(); // Initial update
      
      return () => window.removeEventListener('resize', smoothlyUpdateCamera);
    }
  }, [camera]);

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 0, 1.5]} 
      fov={window.innerWidth < 768 ? 75 : 65}
      near={0.1}
      far={1000}
      aspect={window.innerWidth / window.innerHeight}
    />
  );
};

export default ARCamera; 