import React, { useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';

interface GradientTextureProps {
  stops: number[];
  colors: string[];
  size?: number;
  attach: string;
}

const GradientTexture: React.FC<GradientTextureProps> = ({ stops, colors, size = 1024, attach }) => {
  const texture = useMemo(() => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 1;
    const context = canvas.getContext('2d');
    
    if (!context) return new THREE.Texture();
    
    // Create gradient
    const gradient = context.createLinearGradient(0, 0, size, 0);
    stops.forEach((stop, i) => {
      gradient.addColorStop(stop, colors[i]);
    });
    
    // Draw gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, 1);
    
    // Create texture
    const texture = new THREE.CanvasTexture(
      canvas,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter
    );
    
    texture.needsUpdate = true;
    return texture;
  }, [stops.join(','), colors.join(','), size]);
  
  // This ensures the texture is properly attached
  useLayoutEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);
  
  return <primitive object={texture} attach={attach} />;
};

export default GradientTexture; 