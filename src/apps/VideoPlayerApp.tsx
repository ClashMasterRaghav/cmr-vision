import React, { useState, useRef, useEffect } from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';
import '../styles/VideoPlayer.css';

interface VideoFile {
  name: string;
  path: string;
}

interface VideoPlayerAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    videoSrc: string;
    availableVideos?: VideoFile[];
  };
}

const VideoPlayerApp: React.FC<VideoPlayerAppProps> = ({ id, title, onClose, data }) => {
  // Use video data with fallbacks
  const availableVideos = data.availableVideos || [];
  const [currentVideoSrc, setCurrentVideoSrc] = useState(data.videoSrc || getAssetPath('videos/sample-video.mp4'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Handle video selection change
  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSrc = e.target.value;
    setCurrentVideoSrc(newSrc);
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
  };

  // Manual play function to handle user interaction requirement
  const handlePlayVideo = () => {
    if (!videoRef.current) return;
    
    videoRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setError(null);
      })
      .catch(err => {
        console.log('Play failed:', err);
        setError('Could not play video. ' + err.message);
      });
  };

  // Effect to handle video loading
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleCanPlay = () => {
      setIsLoading(false);
      // Don't autoplay - require user interaction
      setError('Click Play to start the video');
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError('Could not load video. The file may not exist or is not accessible.');
      console.error('Video error:', videoElement.error);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('ended', handleEnded);
    
    // Force load the video
    videoElement.load();
    
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('ended', handleEnded);
      // Ensure video is paused when component unmounts
      videoElement.pause();
    };
  }, [currentVideoSrc]);
  
  return (
    <AppWindow 
      id={id}
      title={title} 
      onClose={onClose}
    >
      <div className="video-player-container">
        <div className="video-player-toolbar">
          <div className="video-select-container">
            <label htmlFor="video-select" style={{ fontSize: '12px', color: '#000000' }}>
              Select video:
            </label>
            <select 
              id="video-select"
              className="video-select"
              value={currentVideoSrc}
              onChange={handleVideoChange}
              style={{ color: 'black' }}
            >
              {availableVideos.length > 0 ? (
                availableVideos.map((video, index) => (
                  <option key={index} value={video.path} style={{ color: 'black' }}>
                    {video.name}
                  </option>
                ))
              ) : (
                <option value={currentVideoSrc} style={{ color: 'black' }}>Default Video</option>
              )}
            </select>
          </div>
          
          {!isLoading && !isPlaying && (
            <button 
              onClick={handlePlayVideo}
              style={{ 
                marginLeft: '10px', 
                padding: '2px 8px', 
                background: '#ECE9D8', 
                border: '1px solid #ACA899', 
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Play
            </button>
          )}
        </div>
        
        <div className="video-playback-area">
          {isLoading && (
            <div className="video-loading">
              <div className="loader-large"></div>
              <p>Loading video...</p>
            </div>
          )}
          
          {error && (
            <div className="video-error">
              <p>{error}</p>
              <button 
                onClick={handlePlayVideo}
                style={{ 
                  padding: '5px 10px', 
                  background: '#ECE9D8', 
                  border: '1px solid #ACA899', 
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Play Video
              </button>
            </div>
          )}
          
          <video
            ref={videoRef}
            controls
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              display: isLoading ? 'none' : 'block'
            }}
            preload="auto"
          >
            <source src={currentVideoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </AppWindow>
  );
};

export default VideoPlayerApp;
