import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Paint.css';
import { getAssetPath } from '../../utils/assetUtils';
// Import images
import pencilIcon from '/images/icons/pencil.png';
import eraserIcon from '/images/icons/eraser.png';
import crossIcon from '/images/icons/cross.png';
import undoIcon from '/images/icons/undo.png';
import redoIcon from '/images/icons/redo.png';

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
    
    // Save initial empty canvas to history
    const initialState = canvas.toDataURL();
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    contextRef.current.lineWidth = brushSize;
  }, [color, brushSize, tool]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !contextRef.current) return;
      
      // Save current image
      const currentImage = canvas.toDataURL();
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore context properties
      const context = contextRef.current;
      context.lineCap = 'round';
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      context.lineWidth = brushSize;
      
      // Redraw the image
      const img = new Image();
      img.src = currentImage;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [color, brushSize, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    // Calculate coordinates as a ratio of canvas dimensions
    const x = (e.clientX - rect.left) / rect.width * canvas.width;
    const y = (e.clientY - rect.top) / rect.height * canvas.height;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    // Calculate coordinates as a ratio of canvas dimensions
    const x = (e.clientX - rect.left) / rect.width * canvasRef.current.width;
    const y = (e.clientY - rect.top) / rect.height * canvasRef.current.height;
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Save current state to history
    const currentState = canvasRef.current.toDataURL();
    
    // Remove any "future" states if we drew after undoing
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    contextRef.current.clearRect(
      0, 0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    
    // Save cleared state to history
    const clearedState = canvasRef.current.toDataURL();
    setHistory([...history, clearedState]);
    setHistoryIndex(history.length);
  };

  const undo = () => {
    if (historyIndex <= 0 || !canvasRef.current || !contextRef.current) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    // Load the previous state
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      contextRef.current?.clearRect(
        0, 0, 
        canvasRef.current!.width, 
        canvasRef.current!.height
      );
      contextRef.current?.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !canvasRef.current || !contextRef.current) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    // Load the next state
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      contextRef.current?.clearRect(
        0, 0, 
        canvasRef.current!.width, 
        canvasRef.current!.height
      );
      contextRef.current?.drawImage(img, 0, 0);
    };
  };

  return (
    <div className="paint-container">
      <div className="paint-toolbar">
        <div className="paint-tools">
          <button 
            className={`paint-tool-button ${tool === 'pencil' ? 'active' : ''}`}
            onClick={() => setTool('pencil')}
            title="Pencil"
          >
            <img src={getAssetPath('images/icons/pencil.png')} alt="Pencil" width="16" height="16" />
          </button>
          <button 
            className={`paint-tool-button ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <img src={getAssetPath('images/icons/eraser.png')} alt="Eraser" width="16" height="16" />
          </button>
          <button 
            className="paint-tool-button"
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            <img src={getAssetPath('images/icons/cross.png')} alt="Clear Canvas" width="16" height="16" />
          </button>
        </div>
        
        <div className="paint-history-controls">
          <button 
            className="paint-tool-button"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <img src={getAssetPath('images/icons/undo.png')} alt="Undo" width="16" height="16" />
          </button>
          <button 
            className="paint-tool-button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <img src={getAssetPath('images/icons/redo.png')} alt="Redo" width="16" height="16" />
          </button>
        </div>
        
        <div className="paint-settings">
          <div className="paint-color-picker">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={tool === 'eraser'}
              title="Choose Color"
            />
          </div>
          <div className="paint-brush-size">
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              title="Brush Size"
            />
            <span>{brushSize}px</span>
          </div>
        </div>
      </div>
      
      <div className="paint-canvas-container">
        <canvas
          ref={canvasRef}
          className="paint-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Paint; 