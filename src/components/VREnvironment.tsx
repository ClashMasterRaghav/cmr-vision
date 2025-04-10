import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { useAppStore } from '../stores/appStore';
import AppWindow from './AppWindow';
import { OrbitControls, Environment, Sky, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Create a custom OrbitControls component that we can control
const ControlledOrbitControls = () => {
  const controlsRef = useRef<any>(null);
  const { gl, camera } = useThree();
  
  // Register the controls ref with the DOM element for access from other components
  useFrame(() => {
    if (controlsRef.current) {
      (gl.domElement as any).__r3f = {
        ...(gl.domElement as any).__r3f,
        controls: controlsRef.current
      };
    }
  });
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={20}
      // Limit vertical rotation to prevent disorientation
      minPolarAngle={Math.PI / 6} // 30 degrees
      maxPolarAngle={Math.PI / 1.5} // 120 degrees
    />
  );
};

// Animated window with view outside
const AnimatedWindow = () => {
  const [cloudPosition, setCloudPosition] = useState(15);
  const [birdPosition, setBirdPosition] = useState(-10);
  
  // Animate clouds and birds
  useFrame(({ clock }) => {
    // Slow cloud movement
    const newCloudPos = 15 - ((clock.getElapsedTime() * 0.1) % 30);
    setCloudPosition(newCloudPos);
    
    // Faster bird movement
    const newBirdPos = -10 + ((clock.getElapsedTime() * 0.5) % 20);
    setBirdPosition(newBirdPos);
  });
  
  return (
    <group position={[0, 2, 9.9]}>
      {/* Sky backdrop */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.9} />
      </mesh>
      
      {/* Distant mountains */}
      <group position={[0, -1, 0.01]} rotation={[0, Math.PI, 0]}>
        <mesh position={[-1.5, 0, 0]}>
          <coneGeometry args={[1.5, 1.2, 4]} />
          <meshStandardMaterial color="#6a8caf" />
        </mesh>
        <mesh position={[1, 0, -0.2]}>
          <coneGeometry args={[2, 1.5, 4]} />
          <meshStandardMaterial color="#4a6c8f" />
        </mesh>
      </group>
      
      {/* Clouds */}
      <group position={[cloudPosition, 1, 0.02]} rotation={[0, Math.PI, 0]}>
        <Cloud position={[0, 0, 0]} scale={[0.6, 0.4, 0.4]} />
        <Cloud position={[-2, -0.3, 0.1]} scale={[0.4, 0.3, 0.3]} />
        <Cloud position={[3, 0.5, 0.05]} scale={[0.7, 0.5, 0.4]} />
      </group>
      
      {/* Birds */}
      <group position={[birdPosition, 0.8, 0.03]} rotation={[0, Math.PI, 0]}>
        <Bird position={[0, 0, 0]} />
        <Bird position={[0.3, 0.2, 0]} scale={[0.8, 0.8, 0.8]} />
        <Bird position={[-0.3, -0.1, 0]} scale={[0.7, 0.7, 0.7]} />
      </group>
      
      {/* Window frame */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.05]}>
        <boxGeometry args={[6.4, 4.4, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Window glass reflections */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, 0.01]}>
        <planeGeometry args={[6, 4]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
        />
      </mesh>
      
      {/* Window dividers */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, 0.03]}>
        <boxGeometry args={[0.1, 4, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, 0.03]}>
        <boxGeometry args={[6, 0.1, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

// Simple cloud shape
const Cloud = ({ position = [0, 0, 0] as [number, number, number], scale = [1, 1, 1] as [number, number, number] }) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.4, 0.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, 0.1, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.2, 0.3, 0]}>
        <sphereGeometry args={[0.37, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

// Simple bird silhouette
const Bird = ({ position = [0, 0, 0] as [number, number, number], scale = [1, 1, 1] as [number, number, number] }) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// Animated houseplant
const Houseplant = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
  const [leafMovement, setLeafMovement] = useState(0);
  
  useFrame(({ clock }) => {
    // Gentle swaying movement
    setLeafMovement(Math.sin(clock.getElapsedTime() * 0.5) * 0.05);
  });
  
  return (
    <group position={position} rotation={rotation}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#cc7f3b" roughness={1} metalness={0} />
      </mesh>
      
      {/* Stem */}
      <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#2e8b57" roughness={1} metalness={0} />
      </mesh>
      
      {/* Leaves */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI / 2) + leafMovement;
        const x = Math.cos(angle) * 0.2;
        const z = Math.sin(angle) * 0.2;
        
        return (
          <mesh 
            key={i} 
            position={[x, 0.9 + (i % 2) * 0.1, z]} 
            rotation={[
              Math.PI / 2 + (i % 2) * 0.2, 
              0, 
              angle + Math.PI/4 + leafMovement * (i % 2 ? 1 : -1)
            ]}
            receiveShadow 
            castShadow
          >
            <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2e8b57" roughness={1} metalness={0} />
          </mesh>
        );
      })}
    </group>
  );
};

// Animated table lamp
const TableLamp = ({ position = [0, 0, 0] as [number, number, number], on = true }) => {
  const [lightIntensity, setLightIntensity] = useState(on ? 1 : 0);
  const [flickerTimer, setFlickerTimer] = useState(0);
  
  useFrame(({ clock }) => {
    // Occasional light flicker effect
    if (on) {
      const time = clock.getElapsedTime();
      if (time - flickerTimer > 7 + Math.random() * 20) {
        setFlickerTimer(time);
        // Brief flicker down and back up
        setTimeout(() => setLightIntensity(0.7), 100);
        setTimeout(() => setLightIntensity(0.5), 200);
        setTimeout(() => setLightIntensity(0.8), 300);
        setTimeout(() => setLightIntensity(1), 400);
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Lamp base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Lamp arm */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.7} />
      </mesh>
      
      {/* Lamp shade */}
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 16, 1, true]} />
        <meshStandardMaterial 
          color="#f0e9d8" 
          roughness={0.8} 
          metalness={0.1}
          side={THREE.DoubleSide}
          emissive="#f8e7c8"
          emissiveIntensity={lightIntensity * 0.3}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight 
        position={[0, 0.9, 0]} 
        intensity={lightIntensity} 
        color="#f8e7c8" 
        distance={5} 
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </group>
  );
};

// Room component with furniture
const Room = () => {
  // Time-based animation for subtle movement
  const [time, setTime] = useState(0);
  
  useFrame(({ clock }) => {
    setTime(clock.getElapsedTime());
  });
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e0d9c5" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f2e9" roughness={1} metalness={0} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#d6ecf5" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#e6d7ee" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 2, -10]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#f2e2d9" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Front wall with window */}
      <mesh position={[0, 2, 10]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#f2e2d9" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Animated window */}
      <AnimatedWindow />
      
      {/* Desk at back wall */}
      <mesh position={[0, -0.5, -8]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.1, 2]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Desk legs */}
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, -1.25, -8]} receiveShadow castShadow>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#5D3A20" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
      
      {/* Desk lamp */}
      <TableLamp position={[2, -0.45, -8.5]} />
      
      {/* Chair */}
      <mesh position={[0, -1, -6.5]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#5D3A20" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Animated plant in corner */}
      <Houseplant position={[-8, -2, -8]} />
      
      {/* Bookshelf */}
      <mesh position={[8, 0, -5]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Books on shelf - with subtle animation */}
      {[0, 1, 2].map((y) => (
        <mesh 
          key={y} 
          position={[
            8, 
            -1 + y * 1.3 + Math.sin(time * 0.5 + y) * 0.005, // Subtle vertical movement
            -4.7
          ]} 
          rotation={[
            0, 
            Math.PI / 2 + Math.sin(time * 0.2 + y * 2) * 0.02, // Subtle rotation
            0
          ]} 
          receiveShadow castShadow
        >
          <boxGeometry args={[0.8, 1, 1.5]} />
          <meshStandardMaterial 
            color={["#e63946", "#457b9d", "#1d3557"][y]} 
            roughness={0.8} 
            metalness={0.2} 
          />
        </mesh>
      ))}
      
      {/* Small coffee table */}
      <mesh position={[0, -1.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>
      
      {/* Coffee cup on table with steam */}
      <group position={[0.5, -1.3, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.15, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="white" roughness={0.5} metalness={0.1} />
        </mesh>
        <mesh position={[0.15, 0, 0]} receiveShadow castShadow>
          <torusGeometry args={[0.08, 0.03, 16, 24, Math.PI]} />
          <meshStandardMaterial color="white" roughness={0.5} metalness={0.1} />
        </mesh>
        
        {/* Coffee inside cup */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.13, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#3c2415" roughness={0.3} metalness={0.3} />
        </mesh>
        
        {/* Steam particles */}
        {[0, 1, 2].map((i) => (
          <mesh 
            key={i} 
            position={[
              0, 
              0.15 + i * 0.1 + Math.sin(time * (1 + i * 0.2) + i * 2) * 0.05,
              0
            ]} 
            scale={[
              0.05 - i * 0.01, 
              0.05 - i * 0.01, 
              0.05 - i * 0.01
            ]}
          >
            <sphereGeometry />
            <meshBasicMaterial 
              color="white" 
              transparent 
              opacity={0.3 - (i * 0.07) + Math.sin(time * 2 + i) * 0.05} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Couch */}
      <group position={[0, -1.5, 6]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[6, 0.5, 2]} />
          <meshStandardMaterial color="#4c72b0" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0, 1, -0.8]} receiveShadow castShadow>
          <boxGeometry args={[6, 1, 0.4]} />
          <meshStandardMaterial color="#4c72b0" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[-2.9, 0.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 0.5, 2]} />
          <meshStandardMaterial color="#3b5b92" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[2.9, 0.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 0.5, 2]} />
          <meshStandardMaterial color="#3b5b92" roughness={1} metalness={0} />
        </mesh>
        
        {/* Cushions with subtle animation */}
        {[-2, 0, 2].map((x) => (
          <mesh 
            key={x} 
            position={[
              x, 
              0.01 + Math.sin(time * 0.3 + x) * 0.01, // Very subtle vertical movement 
              0
            ]} 
            receiveShadow 
            castShadow
          >
            <boxGeometry args={[1.8, 0.3, 1.8]} />
            <meshStandardMaterial color="#5d82c1" roughness={1} metalness={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Scene component that will be rendered in VR
const VRScene = () => {
  const { apps } = useAppStore();
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Soft area light for warm glow */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffefb9" />
      
      {/* Window light */}
      <pointLight position={[0, 2, 8]} intensity={0.8} color="#8fb1e0" />
      
      {/* Room environment */}
      <Room />
      
      {/* Render all app windows */}
      {apps.map((app) => (
        <AppWindow key={app.id} app={app} />
      ))}
      
      {/* Environment lighting */}
      <Environment preset="apartment" />
      
      {/* Sky visible through window */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.25} />
      
      {/* Controls */}
      <ControlledOrbitControls />
    </>
  );
};

const VREnvironment = () => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true 
        }}
      >
        <VRScene />
      </Canvas>
    </div>
  );
};

export default VREnvironment;
