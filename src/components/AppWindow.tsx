import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface AppWindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ title, children, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      setActive(true);
    }
    e.stopPropagation();
  };

  // Handle mouse down to start resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY
      });
      setInitialSize({
        width: size.width,
        height: size.height
      });
      setIsResizing(true);
      setActive(true);
    }
    e.stopPropagation();
    e.preventDefault();
  };

  // Handle mouse move during dragging or resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing) {
      const deltaWidth = e.clientX - resizeStart.x;
      const deltaHeight = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(300, initialSize.width + deltaWidth);
      const newHeight = Math.max(200, initialSize.height + deltaHeight);
      
      setSize({
        width: newWidth,
        height: newHeight
      });
    }
  };

  // Handle mouse up to stop dragging or resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Set window as active on click
  const handleWindowClick = () => {
    setActive(true);
  };

  // Handle click outside to deactivate window
  const handleClickOutside = (e: MouseEvent) => {
    if (windowRef.current && !windowRef.current.contains(e.target as Node)) {
      setActive(false);
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    // Add global click handler for focus/active state
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, initialSize]);

  return (
    <div 
      ref={windowRef}
      className={`app-window ${active ? 'app-window-active' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        zIndex: active ? 100 : 10,
        transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease, box-shadow 0.3s ease',
      }}
      onClick={handleWindowClick}
    >
      <div 
        className="app-window-header"
        onMouseDown={handleMouseDown}
      >
        <h3 className="app-window-title">{title}</h3>
        <div className="app-window-controls">
          <button className="app-window-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="app-window-content" style={{ height: 'calc(100% - 30px)', overflow: 'hidden' }}>
        {children}
      </div>
      <div 
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 9L9 1M5 9L9 5M9 9L9 9" />
        </svg>
      </div>
    </div>
  );
};

export default AppWindow;
