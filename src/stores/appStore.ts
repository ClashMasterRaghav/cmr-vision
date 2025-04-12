import { create } from 'zustand';
import { Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';

// Define the different app types
export type AppType = 'videoPlayer' | 'youtube' | 'googleMaps' | 'browser' | 'notepad' | 'paint' | 'calculator' | 'calendar' | 'myComputer' | 'recycleBin';

// Define app window data structure
export interface AppWindow {
  id: string;
  type: AppType;
  title: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  isActive: boolean;
  isMinimized: boolean;
  data: any; // App-specific data
}

// Define store state
interface AppState {
  apps: AppWindow[];
  activeAppId: string | null;
  addApp: (appData: Omit<AppWindow, 'id' | 'isMinimized'>) => void;
  removeApp: (id: string) => void;
  setActiveApp: (id: string) => void;
  updateAppPosition: (id: string, position: Vector3) => void;
  toggleMinimize: (id: string) => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  apps: [],
  activeAppId: null,
  
  // Add a new app
  addApp: (appData) => set((state) => {
    // Deactivate all other apps
    const updatedApps = state.apps.map(app => ({
      ...app,
      isActive: false
    }));
    
    // Create new app with unique ID
    const newApp: AppWindow = {
      ...appData,
      id: uuidv4(),
      isActive: true,
      isMinimized: false
    };
    
    return {
      apps: [...updatedApps, newApp],
      activeAppId: newApp.id
    };
  }),
  
  // Remove an app
  removeApp: (id) => set((state) => {
    const remainingApps = state.apps.filter(app => app.id !== id);
    const newActiveId = state.activeAppId === id 
      ? (remainingApps.length > 0 ? remainingApps[remainingApps.length - 1].id : null) 
      : state.activeAppId;
      
    return {
      apps: remainingApps,
      activeAppId: newActiveId
    };
  }),
  
  // Set the active app
  setActiveApp: (id) => set((state) => {
    // Get the app to be activated
    const appToActivate = state.apps.find(app => app.id === id);
    
    // If the app is minimized, unminimize it
    if (appToActivate?.isMinimized) {
      return {
        apps: state.apps.map(app => ({
          ...app,
          isActive: app.id === id,
          isMinimized: app.id === id ? false : app.isMinimized
        })),
        activeAppId: id
      };
    }
    
    return {
      apps: state.apps.map(app => ({
        ...app,
        isActive: app.id === id
      })),
      activeAppId: id
    };
  }),
  
  // Update app position (for dragging)
  updateAppPosition: (id, position) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id 
        ? { ...app, position } 
        : app
    )
  })),
  
  // Toggle minimize state
  toggleMinimize: (id) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id 
        ? { 
            ...app, 
            isMinimized: !app.isMinimized,
            isActive: app.isMinimized // If it was minimized, make it active
          } 
        : app
    ),
    activeAppId: state.apps.find(app => app.id === id)?.isMinimized ? id : state.activeAppId
  }))
}));