import { useState, useRef, useEffect } from 'react';
import { AppWindow } from '../../stores/appStore';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface VideoPlayerProps {
  app: AppWindow;
}

// Inline base64 encoded small video as fallback
const FALLBACK_VIDEO = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAsZtZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PWluZmluaXRlIGtleWludF9taW49Mjkgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAdzZYiEAD//8m+P5OXfBeLGOfKE3xQdkhiY0b2cV4Wz+uCnASAAAAwAAAwAAIxsaqCiDQQFAAOgAAAAAHAAACGtKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEeQAAAAAAAAAAQ7PFrPVR32J1IyljSYYm0KkbIAAAAAAAAAAAABGBGzfkxsQOlRY1Y9Ue+n5G/vA4K5TmRwYXAxM8G//GpXUMmfsgXytwRW/NfbXHYcizfFPZaxL45ZaYAAAMlZM6Xt6Ys4AAAAMGAAAwAAAUGHMQAAAMGjWA=";

const VideoPlayerApp = ({ app }: VideoPlayerProps) => {
  const { gl } = useThree();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Get video source from app data
  const videoSrc = app.data?.videoSrc || '/videos/sample.mp4';
  
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Handlers for various events
      const handleCanPlay = () => setIsLoaded(true);
      const handleError = () => {
        console.error("Error loading video:", videoSrc);
        setError(true);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      // Add event listeners
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      
      // Remove event listeners on cleanup
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [videoSrc]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

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
        <div style={{ width: '560px', height: '315px', position: 'relative' }}>
          {!error ? (
            <>
              <video
                ref={videoRef}
                width="560"
                height="315"
                controls
                style={{ width: '100%', height: '100%' }}
                src={videoSrc}
                onClick={togglePlay}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: isLoaded ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}>
                Loading video...
              </div>
            </>
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#000', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                <div>Video cannot be played.<br/>
                The file may be missing or in an unsupported format.</div>
                <div style={{ 
                  marginTop: '15px', 
                  fontSize: '12px', 
                  color: '#888' 
                }}>
                  Source: {videoSrc}
                </div>
              </div>
            </div>
          )}
        </div>
      </Html>
    </mesh>
  );
};

export default VideoPlayerApp; 