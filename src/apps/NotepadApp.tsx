import React from 'react';
import Notepad from '../components/apps/Notepad';
import { getAssetPath } from '../utils/assetUtils';

interface NotepadAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: {
    content?: string;
  };
}

const NotepadApp: React.FC<NotepadAppProps> = ({ id, title, onClose, data }) => {
  return (
    <Notepad 
      id={id}
      title={title}
      onClose={onClose}
      data={data}
    />
  );
};

export default NotepadApp; 