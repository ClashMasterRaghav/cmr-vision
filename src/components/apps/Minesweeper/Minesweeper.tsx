import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Minesweeper.css';

// Difficulty levels
const LEVELS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

// Cell state definition
interface Cell {
  revealed: boolean;
  hasMine: boolean;
  flagged: boolean;
  questionMark: boolean;
  mineCount: number;
}

// Props for the Minesweeper component
interface MinesweeperProps {
  data?: {
    initialSize?: {
      width: number;
      height: number;
    }
  };
}

const Minesweeper: React.FC<MinesweeperProps> = ({ data }) => {
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(LEVELS[level].mines);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [faceState, setFaceState] = useState('🙂');
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to calculate window size based on grid dimensions
  const getWindowSize = (level: 'beginner' | 'intermediate' | 'expert') => {
    const { rows, cols } = LEVELS[level];
    // Cell size is 24px, add significant padding for a comfortable header
    let width = cols * 24 + 150; // Add extra padding to make header less congested
    const height = rows * 24 + 160; // Add extra for header, footer, and padding
    
    // Ensure minimum width for all levels
    width = Math.max(400, width);
    
    return { width, height };
  };

  // Initial setup with provided size
  useEffect(() => {
    if (data?.initialSize) {
      // Set initial size of parent window
      const appWindow = containerRef.current?.closest('.app-window');
      if (appWindow) {
        (appWindow as HTMLElement).style.width = `${data.initialSize.width}px`;
        (appWindow as HTMLElement).style.height = `${data.initialSize.height}px`;
      }
    }
  }, [data]);

  // Resize parent window when level changes
  useEffect(() => {
    // Get parent AppWindow element
    const appWindow = containerRef.current?.closest('.app-window');
    if (appWindow) {
      const { width, height } = getWindowSize(level);
      (appWindow as HTMLElement).style.width = `${width}px`;
      (appWindow as HTMLElement).style.height = `${height}px`;
    }
  }, [level]);
  
  // Initialize the grid
  const initializeGrid = useCallback(() => {
    const { rows, cols } = LEVELS[level];
    const newGrid: Cell[][] = [];

    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          revealed: false,
          hasMine: false,
          flagged: false,
          questionMark: false,
          mineCount: 0
        });
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
    setMinesLeft(LEVELS[level].mines);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
    setIsTimerRunning(false);
    setFirstClick(true);
    setFaceState('🙂');
  }, [level]);

  // Place mines after the first click
  const placeMines = (rowClicked: number, colClicked: number) => {
    const { rows, cols, mines } = LEVELS[level];
    const newGrid = [...grid];
    let minesPlaced = 0;

    // Place mines randomly
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);

      // Skip the clicked cell and its neighbors
      if (Math.abs(randomRow - rowClicked) <= 1 && Math.abs(randomCol - colClicked) <= 1) {
        continue;
      }

      if (!newGrid[randomRow][randomCol].hasMine) {
        newGrid[randomRow][randomCol].hasMine = true;
        minesPlaced++;
      }
    }

    // Calculate mine counts for each cell
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j].hasMine) continue;
        
        let count = 0;
        // Check all 8 neighbors
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            
            const ni = i + di;
            const nj = j + dj;
            
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newGrid[ni][nj].hasMine) {
              count++;
            }
          }
        }
        newGrid[i][j].mineCount = count;
      }
    }

    setGrid(newGrid);
  };

  // Reveal cell and its neighbors if it's a zero
  const revealCell = (row: number, col: number, newGrid = [...grid]) => {
    const { rows, cols } = LEVELS[level];
    
    if (
      row < 0 || row >= rows || 
      col < 0 || col >= cols || 
      newGrid[row][col].revealed || 
      newGrid[row][col].flagged
    ) {
      return newGrid;
    }

    newGrid[row][col].revealed = true;

    // If it's a mine, game over
    if (newGrid[row][col].hasMine) {
      setGameOver(true);
      setIsTimerRunning(false);
      setFaceState('😵');
      
      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newGrid[i][j].hasMine) {
            newGrid[i][j].revealed = true;
          }
          // Mark incorrectly flagged cells
          if (newGrid[i][j].flagged && !newGrid[i][j].hasMine) {
            newGrid[i][j].revealed = true;
          }
        }
      }
      return newGrid;
    }

    // If it's a zero, reveal neighbors
    if (newGrid[row][col].mineCount === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          newGrid = revealCell(row + di, col + dj, newGrid);
        }
      }
    }

    return newGrid;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon || grid[row][col].flagged) return;

    // Start timer on first click
    if (firstClick) {
      setFirstClick(false);
      setIsTimerRunning(true);
      placeMines(row, col);
    }

    const newGrid = revealCell(row, col);
    setGrid(newGrid);

    // Check if game is won
    checkWinCondition(newGrid);
  };

  // Handle right-click (flag)
  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameOver || gameWon || grid[row][col].revealed) return;

    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (!cell.flagged && !cell.questionMark) {
      // Place a flag
      cell.flagged = true;
      setMinesLeft(minesLeft - 1);
    } else if (cell.flagged) {
      // Change to question mark
      cell.flagged = false;
      cell.questionMark = true;
      setMinesLeft(minesLeft + 1);
    } else {
      // Remove question mark
      cell.questionMark = false;
    }

    setGrid(newGrid);
  };

  // Also allow Alt+Click for flagging
  const handleAltClick = (e: React.MouseEvent, row: number, col: number) => {
    if (e.altKey) {
      handleCellRightClick(e, row, col);
    }
  };

  // Handle face button click (reset game)
  const handleReset = () => {
    initializeGrid();
  };

  // Handle difficulty level change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as 'beginner' | 'intermediate' | 'expert');
  };

  // Check if the game is won
  const checkWinCondition = (currentGrid: Cell[][]) => {
    const { rows, cols, mines } = LEVELS[level];
    let revealedCount = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (currentGrid[i][j].revealed && !currentGrid[i][j].hasMine) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === rows * cols - mines) {
      setGameWon(true);
      setIsTimerRunning(false);
      setFaceState('😎');
      
      // Flag all mines
      const winGrid = [...currentGrid];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (winGrid[i][j].hasMine && !winGrid[i][j].flagged) {
            winGrid[i][j].flagged = true;
          }
        }
      }
      setGrid(winGrid);
      setMinesLeft(0);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Initialize grid on mount or level change
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid, level]);

  // Render the cell
  const renderCell = (cell: Cell, row: number, col: number) => {
    let content = '';
    let cellClass = 'cell';

    if (cell.revealed) {
      cellClass += ' revealed';
      
      if (cell.hasMine) {
        cellClass += ' mine';
      } else if (cell.mineCount > 0) {
        content = cell.mineCount.toString();
        cellClass += ` count-${cell.mineCount}`;
      }
    } else if (cell.flagged) {
      content = '🚩';
      cellClass += ' flagged';
    } else if (cell.questionMark) {
      content = '?';
      cellClass += ' question';
    }

    return (
      <div 
        className={cellClass}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => handleCellRightClick(e, row, col)}
        onMouseDown={(e) => handleAltClick(e, row, col)}
      >
        {content}
      </div>
    );
  };

  // Format timer display
  const formatTimer = (time: number) => {
    return time.toString().padStart(3, '0');
  };

  return (
    <div className="minesweeper" ref={containerRef}>
      <header className="minesweeper-header">
        <div className="minesweeper-counter mine-counter">{minesLeft.toString().padStart(3, '0')}</div>
        <div className="minesweeper-controls">
          <select 
            className="minesweeper-level" 
            value={level} 
            onChange={handleLevelChange}
            disabled={!firstClick}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <button className="minesweeper-reset" onClick={handleReset}>{faceState}</button>
        </div>
        <div className="minesweeper-counter timer">{formatTimer(timer)}</div>
      </header>
      
      <div className={`minesweeper-grid level-${level} ${gameOver ? 'game-over' : ''} ${gameWon ? 'game-won' : ''}`}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="minesweeper-row">
            {row.map((cell, colIndex) => (
              <React.Fragment key={colIndex}>
                {renderCell(cell, rowIndex, colIndex)}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      
      <div className="minesweeper-footer">
        <div className="minesweeper-hint">
          <strong>Flag:</strong> <code><span className="key">alt</span>+<span className="click">click</span></code> or right-click
        </div>
      </div>
    </div>
  );
};

export default Minesweeper; 