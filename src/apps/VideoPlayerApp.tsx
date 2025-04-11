import React from 'react';
import AppWindow from '../components/AppWindow';

interface VideoPlayerAppProps {
  id: string; // Needed for app identification but not used directly
  title: string;
  onClose: () => void;
  data: {
    videoSrc: string;
  };
}

const VideoPlayerApp: React.FC<VideoPlayerAppProps> = ({ title, onClose, data }) => {
  // Use the video path from data, with fallback
  const videoPath = data.videoSrc || '/videos/sample_video.mp4';
  
  return (
    <AppWindow title={title} onClose={onClose}>
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
