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
  const [position, setPosition] = useState(() => {
    // Calculate center position of the screen
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    return { 
      x: Math.max(0, (vw - 600) / 2),  // centered based on default width
      y: Math.max(0, (vh - 400) / 3)   // slightly above center vertically
    };
  });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeSize, setPreMaximizeSize] = useState({ width: 600, height: 400 });
  const [preMaximizePosition, setPreMaximizePosition] = useState(() => {
    // Calculate center position for pre-maximize state too
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    return { 
      x: Math.max(0, (vw - 600) / 2),
      y: Math.max(0, (vh - 400) / 3)
    };
  });
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
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
    
    // Start animation and then toggle minimized state
    if (!isMinimized) {
      setIsAnimatingMinimize(true);
      setTimeout(() => {
        toggleMinimize(id);
        setIsAnimatingMinimize(false);
      }, 500); // Animation duration increased to 500ms
    } else {
      toggleMinimize(id);
    }
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

  // Calculate taskbar position for minimize animation
  const getTaskbarTarget = () => {
    const taskbarApp = document.querySelector(`.taskbar-app[data-id="${id}"]`);
    if (taskbarApp) {
      const rect = taskbarApp.getBoundingClientRect();
      return { x: rect.left, y: rect.bottom };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight };
  };

  // Don't render if minimized (and not animating)
  if (isMinimized && !isAnimatingMinimize) return null;

  // Get taskbar position for animation target
  const taskbarTarget = getTaskbarTarget();

  return (
    <div 
      ref={windowRef}
      className={`app-window ${isActive ? 'app-window-active' : ''} ${isMaximized ? 'app-window-maximized' : ''} ${isAnimatingMinimize ? 'app-window-minimizing' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging 
          ? 'scale(1.01)' 
          : isAnimatingMinimize 
            ? `translate(${taskbarTarget.x - position.x}px, ${taskbarTarget.y - position.y}px) scale(0.05)` 
            : 'scale(1)',
        zIndex: isActive ? 1000 : 500,
        opacity: isAnimatingMinimize ? 0 : 1,
        transition: isDragging || isResizing 
          ? 'none' 
          : isAnimatingMinimize 
            ? 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out, box-shadow 0.5s ease-in-out' 
            : 'transform 0.2s ease, box-shadow 0.3s ease',
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
            –
          </button>
          <button className="app-window-maximize" onClick={handleMaximize}>
            ◻
          </button>
          <button className="app-window-close" onClick={onClose}>
            × 
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
