import React from 'react';
import Paint from '../components/apps/Paint';
import AppWindow from '../components/AppWindow';
import { AppWindow as AppWindowType } from '../stores/appStore';

interface PaintAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: any;
}

const PaintApp: React.FC<PaintAppProps> = ({ id, title, onClose, data }) => {
  return (
    <AppWindow
      id={id}
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