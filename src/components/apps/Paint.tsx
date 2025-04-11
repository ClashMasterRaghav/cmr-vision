import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Paint.css';

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button 
            className={`paint-tool-button ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13l-6 6-9-9 6-6L18 13z"></path>
              <path d="M9 5l7 7"></path>
            </svg>
          </button>
          <button 
            className="paint-tool-button"
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="5" y1="5" x2="19" y2="19"></line>
              <line x1="19" y1="5" x2="5" y2="19"></line>
            </svg>
          </button>
        </div>
        
        <div className="paint-history-controls">
          <button 
            className="paint-tool-button"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 14 4 9 9 4"></polyline>
              <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
            </svg>
          </button>
          <button 
            className="paint-tool-button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 4 20 9 15 14"></polyline>
              <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
            </svg>
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