import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ARCamera: React.FC = () => {
  const { camera, gl } = useThree();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const orientationRef = useRef<{alpha: number, beta: number, gamma: number}>({ alpha: 0, beta: 0, gamma: 0 });
  
  // Request device orientation permissions
  useEffect(() => {
    // Check if DeviceOrientationEvent exists and if we need to request permission
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setHasPermission(true);
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // For devices that don't require permission
      setHasPermission(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Setup camera access
  useEffect(() => {
    if (!hasPermission) return;

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
          videoRef.current.play();
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
  }, [hasPermission]);

  // Handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      orientationRef.current = {
        alpha: event.alpha, // Compass direction (0-360)
        beta: event.beta,   // Front-to-back tilt (-180-180)
        gamma: event.gamma  // Left-to-right tilt (-90-90)
      };
    }
  };

  // Update camera rotation based on device orientation
  useFrame(() => {
    if (!hasPermission) return;

    // Convert orientation data to radians
    const alpha = THREE.MathUtils.degToRad(orientationRef.current.alpha);
    const beta = THREE.MathUtils.degToRad(orientationRef.current.beta);
    const gamma = THREE.MathUtils.degToRad(orientationRef.current.gamma);

    // Create a quaternion from device orientation
    const quaternion = new THREE.Quaternion();
    
    // Apply device orientation to camera
    // This needs adjustment based on device orientation and desired camera behavior
    const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
    quaternion.setFromEuler(euler);
    
    // Apply to camera
    camera.quaternion.copy(quaternion);
  });

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 1.6, 0]} // Typical human eye height
      fov={75} 
    />
  );
};

export default ARCamera; 