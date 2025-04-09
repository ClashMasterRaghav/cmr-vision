import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Type for the orientation data
interface OrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

const ARCamera: React.FC = () => {
  const { camera } = useThree();
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const orientationRef = useRef<OrientationData>({ alpha: 0, beta: 0, gamma: 0 });
  
  // Request device orientation permissions
  useEffect(() => {
    // Setup a safe event handler that works in all browsers
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        orientationRef.current = {
          alpha: event.alpha, // Compass direction (0-360)
          beta: event.beta,   // Front-to-back tilt (-180-180)
          gamma: event.gamma  // Left-to-right tilt (-90-90)
        };
      }
    };

    // Try to request device orientation permission (for iOS 13+)
    const requestDeviceOrientationPermission = async () => {
      try {
        // Check if the DeviceOrientationEvent has a requestPermission method (iOS 13+)
        if (typeof window !== 'undefined' && 
            window.DeviceOrientationEvent && 
            typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
            
          const permissionState = await (window.DeviceOrientationEvent as any).requestPermission();
          return permissionState === 'granted';
        }
        // If the method doesn't exist, assume permission is granted
        return true;
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        return false;
      }
    };

    // Initialize device orientation if available
    const initDeviceOrientation = async () => {
      // Check if orientation is generally supported
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        // Request permission if needed
        const hasOrientationPermission = await requestDeviceOrientationPermission();
        
        if (hasOrientationPermission) {
          setHasPermission(true);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      } else {
        console.warn('Device orientation not supported by this browser');
      }
    };

    // Start initialization
    initDeviceOrientation();

    // Clean up listener on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, []);

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
          setHasPermission(true);
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

  // Set the camera to a fixed position for better mobile viewing
  useEffect(() => {
    if (camera) {
      // Position the camera at a fixed point looking at the content
      camera.position.set(0, 0, 4); // Pulled back to see more content
      camera.lookAt(0, 0, 0);
      
      // Updating aspect ratio when window size changes
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [camera]);

  // Update camera rotation based on device orientation
  useEffect(() => {
    if (!hasPermission) return;

    // Convert orientation data to radians
    const alpha = THREE.MathUtils.degToRad(orientationRef.current.alpha);
    const beta = THREE.MathUtils.degToRad(orientationRef.current.beta);
    const gamma = THREE.MathUtils.degToRad(orientationRef.current.gamma);

    // Create a quaternion from device orientation
    const quaternion = new THREE.Quaternion();
    
    // Apply device orientation to camera
    const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
    quaternion.setFromEuler(euler);
    
    // Apply to camera
    camera.quaternion.copy(quaternion);
  }, [hasPermission, camera]);

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 0, 4]} // Set back to see all content
      fov={85} // Wider FOV to see more content on mobile
      near={0.1}
      far={1000}
    />
  );
};

export default ARCamera; 