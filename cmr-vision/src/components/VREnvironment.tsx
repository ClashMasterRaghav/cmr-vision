import React from 'react';
import { Box } from '@react-three/drei';
import { AppType } from '../App';
import VideoApp from './apps/VideoApp';
import YoutubeApp from './apps/YoutubeApp';
import GithubApp from './apps/GithubApp';
import MapsApp from './apps/MapsApp';
import BrowserApp from './apps/BrowserApp';

interface VREnvironmentProps {
  selectedApp: AppType;
}

const VREnvironment: React.FC<VREnvironmentProps> = ({ selectedApp }) => {
  return (
    <group>
      {/* Room environment */}
      <Box args={[30, 15, 30]} position={[0, 0, 0]} scale={[1, 1, 1]}>
        <meshStandardMaterial color="#222222" transparent opacity={0.2} side={2} />
      </Box>
      
      {/* App screens */}
      <group position={[0, 0, -5]}>
        {selectedApp === 'video' && <VideoApp />}
        {selectedApp === 'youtube' && <YoutubeApp />}
        {selectedApp === 'github' && <GithubApp />}
        {selectedApp === 'maps' && <MapsApp />}
        {selectedApp === 'browser' && <BrowserApp />}
        
        {/* Welcome screen when no app is selected */}
        {!selectedApp && (
          <Box args={[10, 6, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#007AFF" />
            <mesh position={[0, 0, 0.051]}>
              <planeGeometry args={[10, 6]} />
              <meshBasicMaterial color="#000000">
                <canvasTexture attach="map" />
              </meshBasicMaterial>
            </mesh>
          </Box>
        )}
      </group>
    </group>
  );
};

export default VREnvironment; 