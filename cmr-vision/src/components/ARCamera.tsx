import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Type for the orientation data
interface OrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

// Interface for DeviceOrientationEvent with requestPermission
interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<string>;
}

// Interface for Window with DeviceOrientationEvent
interface WindowWithDeviceOrientation extends Window {
  DeviceOrientationEvent: {
    prototype: DeviceOrientationEvent;
    new(): DeviceOrientationEvent;
    requestPermission?: () => Promise<string>;
  };
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

    // Check if DeviceOrientationEvent exists and if we need to request permission
    const windowWithOrientation = window as WindowWithDeviceOrientation;
    if (typeof windowWithOrientation !== 'undefined' && 
        typeof windowWithOrientation.DeviceOrientationEvent !== 'undefined') {
      
      // iOS 13+ requires permission
      if (typeof windowWithOrientation.DeviceOrientationEvent.requestPermission === 'function') {
        windowWithOrientation.DeviceOrientationEvent.requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              setHasPermission(true);
              window.addEventListener('deviceorientation', handleDeviceOrientation);
            }
          })
          .catch((error: any) => {
            console.error('Error requesting device orientation permission:', error);
          });
      } else {
        // For devices that don't require permission
        setHasPermission(true);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } else {
      console.warn('Device orientation not supported by this browser');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
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
  }, [hasPermission]);

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