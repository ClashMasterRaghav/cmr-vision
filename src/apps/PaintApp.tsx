import React from 'react';
import Paint from '../components/apps/Paint';
import AppWindow from '../components/AppWindow';

interface PaintAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: any;
}

const PaintApp: React.FC<PaintAppProps> = ({ title, onClose }) => {
  return (
    <AppWindow
      title={title}
      onClose={onClose}
      defaultWidth={800}
      defaultHeight={600}
      minWidth={400}
      minHeight={300}
    >
      <Paint />
    </AppWindow>
  );
};

export default PaintApp; 