import React from 'react';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';
import '../styles/VideoPlayer.css';

interface VideoPlayerAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    videoSrc: string;
  };
}

const VideoPlayerApp: React.FC<VideoPlayerAppProps> = ({ id, title, onClose, data }) => {
  // Use the video path from data, with fallback
  const videoPath = data.videoSrc || getAssetPath('videos/sample-video.mp4');
  
  return (
    <AppWindow 
      id={id}
      title={title} 
      onClose={onClose}
    >
      <div className="video-player-container">
        <video
          controls
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </AppWindow>
  );
};

export default VideoPlayerApp;
