import * as THREE from 'three';

// Storage keys
const APP_POSITIONS_KEY = 'cmr-vision-app-positions';

// Type definitions
export interface StoredPositions {
  [key: string]: { x: number; y: number; z: number };
}

/**
 * Save app positions to localStorage
 */
export const saveAppPositions = (positions: Record<string, THREE.Vector3>): void => {
  try {
    // Convert Vector3 objects to plain objects for JSON serialization
    const storedPositions: StoredPositions = {};
    Object.entries(positions).forEach(([key, vector]) => {
      storedPositions[key] = { 
        x: vector.x, 
        y: vector.y, 
        z: vector.z 
      };
    });
    
    localStorage.setItem(APP_POSITIONS_KEY, JSON.stringify(storedPositions));
  } catch (error) {
    console.error('Error saving app positions:', error);
  }
};

/**
 * Load app positions from localStorage
 */
export const loadAppPositions = (defaultPositions: Record<string, THREE.Vector3>): Record<string, THREE.Vector3> => {
  try {
    const savedPositions = localStorage.getItem(APP_POSITIONS_KEY);
    if (savedPositions) {
      const parsedPositions = JSON.parse(savedPositions) as StoredPositions;
      
      // Convert stored plain objects back to THREE.Vector3
      const vectorPositions: Record<string, THREE.Vector3> = {};
      Object.entries(parsedPositions).forEach(([key, pos]) => {
        vectorPositions[key] = new THREE.Vector3(pos.x, pos.y, pos.z);
      });
      
      return vectorPositions;
    }
  } catch (error) {
    console.error('Error loading app positions:', error);
  }
  
  return defaultPositions;
}; 