import React, { useRef, useState, useCallback } from 'react';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import Screen from './Screen';

interface DraggableScreenProps {
  contentUrl: string;
  position: THREE.Vector3;
  scale: number;
  title: string;
  onClose?: () => void;
}

const DraggableScreen: React.FC<DraggableScreenProps> = ({ 
  contentUrl, 
  position, 
  scale, 
  title,
  onClose 
}) => {
  const group = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<THREE.Vector3 | null>(null);
  const [cursorPosition, setCursorPosition] = useState(new THREE.Vector3());
  
  // Update cursor style
  useCursor(hover);
  
  // For dragging calculations
  const { camera, mouse } = useThree();
  
  // Standard screen dimensions (16:9 aspect ratio)
  const width = 14;
  const height = 7.875;
  
  // Convert mouse position to world space
  const getMouseWorldPosition = useCallback((z = -2) => {
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = (z - camera.position.z) / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(distance));
  }, [camera, mouse]);
  
  // Handle drag start
  const handleDragStart = useCallback((e: ThreeEvent<MouseEvent | TouchEvent>) => {
    e.stopPropagation();
    if (group.current) {
      setIsDragging(true);
      setDragStartPosition(group.current.position.clone());
      setCursorPosition(getMouseWorldPosition());
    }
  }, [getMouseWorldPosition]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStartPosition(null);
  }, []);
  
  // Update position during dragging
  useFrame(() => {
    if (isDragging && dragStartPosition && group.current) {
      const currentCursorPosition = getMouseWorldPosition();
      const delta = currentCursorPosition.clone().sub(cursorPosition);
      group.current.position.copy(
        dragStartPosition.clone().add(new THREE.Vector3(delta.x, delta.y, 0))
      );
    }
  });
  
  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {/* Title bar (draggable) */}
      <mesh 
        position={[0, height/2 + 0.3, 0]} 
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <planeGeometry args={[width, 0.6]} />
        <meshStandardMaterial color={isDragging ? "#1E90FF" : "#4285F4"} />
        <Html
          position={[0, 0, 0.01]}
          center
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            userSelect: 'none',
            cursor: isDragging ? 'grabbing' : hover ? 'grab' : 'auto',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {title}
        </Html>
        
        {/* Close button */}
        {onClose && (
          <mesh 
            position={[width/2 - 0.4, 0, 0.01]} 
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
          >
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#FF5252" />
            <Html
              position={[0, 0, 0.01]}
              center
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}
            >
              ✕
            </Html>
          </mesh>
        )}
      </mesh>
      
      {/* Screen shadow for better depth perception */}
      <mesh position={[0, 0, -0.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
      
      {/* Screen content */}
      <Screen contentUrl={contentUrl} position={new THREE.Vector3(0, 0, 0)} scale={1} />
    </group>
  );
};

export default DraggableScreen; 