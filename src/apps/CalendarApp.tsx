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

const CalendarApp: React.FC<CalendarAppProps> = ({ id, title, onClose }) => {
  return (
    <AppWindow
      id={id}
      title={title}
      onClose={onClose}
    >
      <Calendar />
    </AppWindow>
  );
};

export default CalendarApp; 