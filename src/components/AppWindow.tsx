import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

interface AppWindowProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

const AppWindow: React.FC<AppWindowProps> = ({ id, title, children, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeSize, setPreMaximizeSize] = useState({ width: 600, height: 400 });
  const [preMaximizePosition, setPreMaximizePosition] = useState({ x: 50, y: 50 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Get app state from store
  const { setActiveApp, toggleMinimize } = useAppStore();
  const { apps, activeAppId } = useAppStore();
  const appData = apps.find(app => app.id === id);
  const isActive = appData?.isActive || false;
  const isMinimized = appData?.isMinimized || false;

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Skip if maximized
    if (isMaximized) return;
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      setActiveApp(id);
    }
    e.stopPropagation();
  };

  // Handle mouse down to start resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    // Skip if maximized
    if (isMaximized) return;
    
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
      setActiveApp(id);
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

  // Handle minimize window
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMinimize(id);
  };

  // Handle maximize window
  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isMaximized) {
      // Save current size and position before maximizing
      setPreMaximizeSize({ width: size.width, height: size.height });
      setPreMaximizePosition({ x: position.x, y: position.y });
      
      // Get viewport dimensions
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      
      // Maximize window
      setSize({ width: vw - 10, height: vh - 50 });
      setPosition({ x: 5, y: 5 });
    } else {
      // Restore pre-maximize size and position
      setSize(preMaximizeSize);
      setPosition(preMaximizePosition);
    }
    
    setIsMaximized(!isMaximized);
  };

  // Set window as active on click
  const handleWindowClick = () => {
    setActiveApp(id);
  };

  // Double click on header to maximize/restore
  const handleHeaderDoubleClick = () => {
    handleMaximize({ stopPropagation: () => {} } as React.MouseEvent);
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, initialSize]);

  // Don't render if minimized
  if (isMinimized) return null;

  return (
    <div 
      ref={windowRef}
      className={`app-window ${isActive ? 'app-window-active' : ''} ${isMaximized ? 'app-window-maximized' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        zIndex: isActive ? 100 : 10,
        transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease, box-shadow 0.3s ease',
      }}
      onClick={handleWindowClick}
    >
      <div 
        className="app-window-header"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleHeaderDoubleClick}
      >
        <h3 className="app-window-title">{title}</h3>
        <div className="app-window-controls">
          <button className="app-window-minimize" onClick={handleMinimize}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"/>
            </svg>
          </button>
          <button className="app-window-maximize" onClick={handleMaximize}>
            {isMaximized ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M4 8h16V4H4v4zm0 6h16v-4H4v4zm0 6h16v-4H4v4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14z"/>
              </svg>
            )}
          </button>
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
      {!isMaximized && (
        <div 
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 9L9 1M5 9L9 5M9 9L9 9" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AppWindow;
