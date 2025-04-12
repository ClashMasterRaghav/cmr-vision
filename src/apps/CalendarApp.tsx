import React from 'react';
import Calendar from '../components/apps/Calendar';
import AppWindow from '../components/AppWindow';
import { getAssetPath } from '../utils/assetUtils';

interface CalendarAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: any;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ title, onClose }) => {
  return (
    <AppWindow
      title={title}
      onClose={onClose}
      defaultWidth={800}
      defaultHeight={600}
      minWidth={500}
      minHeight={400}
    >
      <Calendar />
    </AppWindow>
  );
};

export default CalendarApp; 