import React, { useEffect, useState } from 'react';
import AppWindow from '../components/AppWindow';
import Minesweeper from '../components/apps/Minesweeper';

interface MinesweeperAppProps {
  id: string;
  title: string;
  onClose: () => void;
  data: any;
}

// Calculate initial size for the Minesweeper window based on beginner level grid size with extra width
const INITIAL_SIZE = {
  // Width for beginner level with significant extra space for a comfortable header
  width: Math.max(400, 9 * 24 + 150), // At least 400px wide or grid + 150px padding
  // Height for beginner level (9 cells * 24px) + header + footer + padding
  height: 9 * 24 + 160
};

const MinesweeperApp: React.FC<MinesweeperAppProps> = ({ id, title, onClose, data }) => {
  const [customData, setCustomData] = useState({
    ...data,
    initialSize: INITIAL_SIZE
  });

  return (
    <AppWindow id={id} title={title} onClose={onClose}>
      <Minesweeper data={customData} />
    </AppWindow>
  );
};

export default MinesweeperApp;
