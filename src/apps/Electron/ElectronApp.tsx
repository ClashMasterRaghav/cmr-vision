import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AppWindow } from '../../stores/appStore';

interface ElectronProps {
  app: AppWindow;
}

const ElectronApp = ({ app }: ElectronProps) => {
  const { gl } = useThree();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Get repo from app data
  const repo = app.data?.repo || 'electron/electron';
  
  // Split repo into owner and name
  const [owner, name] = repo.split('/');

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.9, 0.5]} />
      <meshBasicMaterial 
        color={error ? "#ff0000" : "#000000"} 
        opacity={isLoaded ? 0 : 1} 
        transparent 
      />
      
      <Html
  transform
  distanceFactor={2.38} // Same as plane width
  position={[0, 0, 0.01]}
  portal={{ current: gl.domElement.parentNode as HTMLElement }}
  zIndexRange={[16777271, 16777272]}
>
        <div style={{ 
          width: '900px', 
          height: '500px', 
          backgroundColor: '#1b1f23',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid #30363d',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg height="24" width="24" viewBox="0 0 16 16" fill="#ffffff">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
            </svg>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {owner}/<span style={{ color: '#58a6ff' }}>{name}</span>
            </span>
          </div>
          
          {/* Content */}
          <div style={{ 
            flex: 1, 
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Electron</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#c9d1d9' }}>
              Build cross-platform desktop apps with JavaScript, HTML, and CSS.
              Electron is based on Chromium and Node.js, enabling you to build desktop
              applications with web technologies.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px'
              }}>
                <svg height="16" width="16" viewBox="0 0 16 16" fill="#8b949e">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                Stars: 108k+
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px'
              }}>
                <svg height="16" width="16" viewBox="0 0 16 16" fill="#8b949e">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
                Forks: 15k+
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px'
              }}>
                <svg height="16" width="16" viewBox="0 0 16 16" fill="#8b949e">
                  <path d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z" />
                </svg>
                Latest: v27.0.0
              </div>
            </div>
            
            <div style={{
              marginTop: '15px',
              backgroundColor: '#0d1117',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              $ npm install electron --save-dev
            </div>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default ElectronApp; 