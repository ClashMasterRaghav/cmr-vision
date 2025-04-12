import React from 'react';
import Paint from '../components/apps/Paint';
import AppWindow from '../components/AppWindow';

interface PaintAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: any;
}

const PaintApp: React.FC<PaintAppProps> = ({ id, title, onClose }) => {
  return (
    <AppWindow
      id={id}
      title={title}
      onClose={onClose}
    >
      <Paint />
    </AppWindow>
  );
};

export default PaintApp; 