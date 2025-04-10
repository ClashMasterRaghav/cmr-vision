import { create } from 'zustand';
import { Vector3 } from 'three';

export type AppType = 'videoPlayer' | 'youtube' | 'googleMaps' | 'browser' | 'github';

export interface AppWindow {
  id: string;
  type: AppType;
  title: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  isActive: boolean;
  url?: string;
  data?: any;
}

interface AppState {
  apps: AppWindow[];
  activeAppId: string | null;
  addApp: (app: Omit<AppWindow, 'id'>) => void;
  removeApp: (id: string) => void;
  setActiveApp: (id: string) => void;
  updateAppPosition: (id: string, position: Vector3) => void;
  updateAppRotation: (id: string, rotation: Vector3) => void;
  updateAppScale: (id: string, scale: Vector3) => void;
}

export const useAppStore = create<AppState>((set) => ({
  apps: [],
  activeAppId: null,
  
  addApp: (app) => set((state) => {
    const newApp = {
      ...app,
      id: crypto.randomUUID(),
    };
    return { apps: [...state.apps, newApp] };
  }),
  
  removeApp: (id) => set((state) => ({
    apps: state.apps.filter(app => app.id !== id)
  })),
  
  setActiveApp: (id) => set({ activeAppId: id }),
  
  updateAppPosition: (id, position) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id ? { ...app, position } : app
    )
  })),
  
  updateAppRotation: (id, rotation) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id ? { ...app, rotation } : app
    )
  })),
  
  updateAppScale: (id, scale) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id ? { ...app, scale } : app
    )
  })),
})); 