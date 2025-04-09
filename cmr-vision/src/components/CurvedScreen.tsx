import React, { useRef, useState, useCallback } from 'react';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

interface CurvedScreenProps {
  contentUrl: string;
  position: THREE.Vector3;
  scale: number;
  title: string;
  onClose?: () => void;
}

const CurvedScreen: React.FC<CurvedScreenProps> = ({ 
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Update cursor style
  useCursor(hover);
  
  // For dragging calculations
  const { camera, mouse } = useThree();
  
  // Screen dimensions
  const width = 16;
  const height = 9;
  const radius = 10; // Radius of curvature
  const segments = 16; // Number of segments for the curved geometry
  
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

  // Create a curved cylinder geometry for the screen
  const createCurvedGeometry = () => {
    const geometry = new THREE.CylinderGeometry(
      radius, // radius top
      radius, // radius bottom
      height, // height
      segments, // radial segments
      1, // height segments
      true, // open-ended
      Math.PI - Math.atan(width / (2 * radius)), // start angle
      2 * Math.atan(width / (2 * radius)) // angle length (determines width)
    );
    
    // Rotate and position the geometry
    geometry.rotateX(Math.PI / 2);
    geometry.rotateY(Math.PI);
    
    // Flip the UVs to display content correctly
    const uvs = geometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      const u = uvs.getX(i);
      uvs.setX(i, 1 - u);
    }
    
    return geometry;
  };
  
  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {/* Title bar (draggable) */}
      <mesh 
        position={[0, height/2 + 0.4, 0]} 
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <planeGeometry args={[width, 0.8]} />
        <meshStandardMaterial color="#333333" />
        
        {/* Navigation bar with address */}
        <group position={[0, 0, 0.01]}>
          <mesh>
            <planeGeometry args={[width, 0.8]} />
            <meshBasicMaterial color="#202124" />
          </mesh>
          
          {/* URL field */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[width * 0.7, 0.5]} />
            <meshBasicMaterial color="#303134" />
          </mesh>
          
          {/* Navigation buttons */}
          <mesh position={[-width/2 + 1.2, 0, 0.01]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="#202124" />
          </mesh>
          
          {/* Browser controls (minimize, maximize, close) */}
          <mesh position={[width/2 - 1.5, 0, 0.01]}>
            <planeGeometry args={[2, 0.5]} />
            <meshBasicMaterial color="#202124" />
          </mesh>
        </group>
        
        <Html
          position={[0, 0, 0.1]}
          center
          style={{
            color: 'white',
            fontSize: '14px',
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
            position={[width/2 - 0.5, 0, 0.1]} 
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
          >
            <planeGeometry args={[0.6, 0.6]} />
            <meshBasicMaterial color="red" transparent opacity={0.8} />
          </mesh>
        )}
      </mesh>
      
      {/* Curved screen */}
      <mesh position={[0, 0, -radius]}>
        <primitive object={createCurvedGeometry()} attach="geometry" />
        <meshBasicMaterial color="#FFFFFF" side={THREE.BackSide} />
        
        {/* Content */}
        <Html
          transform
          distanceFactor={10}
          position={[0, 0, radius]}
          rotation={[0, Math.PI, 0]}
          style={{
            width: `${width * 200}px`,
            height: `${height * 200}px`,
            transform: `rotate(0deg) translateX(-50%) translateY(-50%)`,
            borderRadius: '20px',
            overflow: 'hidden'
          }}
          className="curved-screen-content"
        >
          <iframe
            ref={iframeRef}
            src={contentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '0 0 20px 20px'
            }}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Html>
      </mesh>
    </group>
  );
};

export default CurvedScreen; 