import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AppType } from '../App';

interface DraggableAppProps {
  children: React.ReactNode;
  position: THREE.Vector3;
  size: [number, number, number];
  onPositionChange?: (position: THREE.Vector3) => void;
}

const DraggableApp: React.FC<DraggableAppProps> = ({ 
  children, 
  position,
  size,
  onPositionChange 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, raycaster, mouse } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3());
  const [initialPosition] = useState<THREE.Vector3>(position.clone());
  
  // Dimensions of the app
  const [width, height, depth] = size;
  
  // Size of the draggable title bar (top 10% of the panel)
  const titleBarHeight = height * 0.1;
  
  // Handle pointer down on the title bar
  const onPointerDown = (e: React.PointerEvent) => {
    // Check if the click is in the title bar area
    // title bar is at the top of the panel
    const appHeight = e.object.geometry.parameters.height;
    const localY = e.point.y - (e.object.position.y - appHeight/2);
    
    // Only allow dragging from the title bar area (top portion)
    if (localY > appHeight - titleBarHeight) {
      e.stopPropagation();
      setIsDragging(true);
      
      // Calculate the offset between the pointer position and the panel's center
      if (groupRef.current) {
        const worldPosition = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPosition);
        
        // Project the world position to the camera's plane
        const planeNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
        const plane = new THREE.Plane(planeNormal);
        
        // Get the ray from the mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Find the intersection point on the plane
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectionPoint);
        
        // Calculate offset
        setDragOffset(intersectionPoint.clone().sub(worldPosition));
      }
    }
  };
  
  // Handle pointer up - end dragging
  const onPointerUp = () => {
    setIsDragging(false);
  };
  
  // Handle pointer move - update position while dragging
  useFrame(() => {
    if (isDragging && groupRef.current) {
      // Use raycaster to find the intersection with a plane perpendicular to the camera
      raycaster.setFromCamera(mouse, camera);
      
      // Create a plane normal to the camera
      const planeNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
      const plane = new THREE.Plane(planeNormal);
      
      // Find the intersection point
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      
      // Adjust position based on the original offset
      const newPosition = intersectionPoint.clone().sub(dragOffset);
      
      // Update the group position
      groupRef.current.position.copy(newPosition);
      
      // Notify parent component of position change
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Title bar for dragging */}
      <mesh 
        position={[0, height/2 - titleBarHeight/2, 0]} 
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <boxGeometry args={[width, titleBarHeight, depth]} />
        <meshStandardMaterial color="#444444" transparent opacity={0.6} />
      </mesh>
      
      {/* Main content */}
      {children}
    </group>
  );
};

export default DraggableApp; 