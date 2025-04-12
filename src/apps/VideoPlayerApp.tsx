import React, { useState, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle video selection change
  const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSrc = e.target.value;
    setCurrentVideoSrc(newSrc);
    
    // Reset video when source changes
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log('Autoplay failed:', err));
    }
  };
  
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
        </div>
        
        <div className="video-playback-area">
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
