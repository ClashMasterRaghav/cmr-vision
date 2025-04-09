import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GradientTexture from './GradientTexture';

const Environment: React.FC = () => {
  const domeRef = useRef<THREE.Mesh>(null);
  
  // Subtle dome rotation
  useFrame(({ clock }) => {
    if (domeRef.current) {
      domeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <group>
      {/* Dome environment */}
      <mesh ref={domeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[30, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            attach="map"
            stops={[0, 0.45, 0.65, 1]}
            colors={['#1e2243', '#2d3157', '#424973', '#6670a4']}
          />
        </meshBasicMaterial>
      </mesh>
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222233" />
      </mesh>
      
      {/* Grid lines - vertical */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i - 10) * 5;
        return (
          <mesh key={`grid-v-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[100, 0.02]} />
            <meshBasicMaterial color="#444466" transparent opacity={0.3} />
          </mesh>
        );
      })}
      
      {/* Grid lines - horizontal */}
      {Array.from({ length: 20 }).map((_, i) => {
        const z = (i - 10) * 5;
        return (
          <mesh key={`grid-h-${i}`} position={[0, 0, z]}>
            <planeGeometry args={[100, 0.02]} />
            <meshBasicMaterial color="#444466" transparent opacity={0.3} />
          </mesh>
        );
      })}
      
      {/* Geometric decorations */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 25 + Math.random() * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 10 + Math.random() * 10;
        const size = 0.2 + Math.random() * 0.3;
        
        return (
          <mesh key={`decoration-${i}`} position={[x, y, z]}>
            <dodecahedronGeometry args={[size, 0]} />
            <meshBasicMaterial color={new THREE.Color().setHSL(i / 50, 0.7, 0.6)} />
          </mesh>
        );
      })}
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
    </group>
  );
};

export default Environment; 