// This is a Node.js script that generates SVG icons for the project
// Usage: node tools/generate-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG generation function (simplified version of the React component)
function generateIconSVG(appType, size = 32) {
  const baseStroke = "#333333";
  const baseFill = "#FFFFFF";
  const accentColor = "#3e95ed";
  const secondaryColor = "#f0ad2d";
  
  // Common SVG wrapper
  const wrapSVG = (content) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${content}</svg>`;
  };
  
  switch (appType) {
    case 'browser':
      return wrapSVG(`
        <circle cx="12" cy="12" r="10" fill="${accentColor}" stroke="${baseStroke}" stroke-width="1" />
        <circle cx="12" cy="12" r="4" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="${baseStroke}" stroke-width="0.5" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="${baseStroke}" stroke-width="0.5" />
      `);
      
    case 'youtube':
      return wrapSVG(`
        <rect x="2" y="5" width="20" height="14" rx="3" fill="#FF0000" />
        <polygon points="10,9 10,15 16,12" fill="${baseFill}" />
      `);
      
    case 'videoPlayer':
      return wrapSVG(`
        <rect x="2" y="4" width="20" height="16" rx="2" fill="${accentColor}" stroke="${baseStroke}" stroke-width="0.5" />
        <polygon points="9,8 9,16 17,12" fill="${baseFill}" />
      `);
      
    case 'googleMaps':
      return wrapSVG(`
        <circle cx="12" cy="12" r="7" fill="#4CAF50" stroke="${baseStroke}" stroke-width="0.5" />
        <circle cx="12" cy="10" r="2" fill="#FF5252" stroke="${baseStroke}" stroke-width="0.5" />
        <path d="M12,10 L12,16" stroke="${baseStroke}" stroke-width="1.5" />
        <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="${baseStroke}" stroke-width="0.5" />
      `);
      
    case 'notepad':
      return wrapSVG(`
        <rect x="4" y="2" width="16" height="20" rx="1" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <line x1="7" y1="6" x2="17" y2="6" stroke="${baseStroke}" stroke-width="0.7" />
        <line x1="7" y1="10" x2="17" y2="10" stroke="${baseStroke}" stroke-width="0.7" />
        <line x1="7" y1="14" x2="17" y2="14" stroke="${baseStroke}" stroke-width="0.7" />
        <line x1="7" y1="18" x2="12" y2="18" stroke="${baseStroke}" stroke-width="0.7" />
      `);
      
    case 'paint':
      return wrapSVG(`
        <rect x="3" y="3" width="18" height="18" rx="2" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <circle cx="8" cy="8" r="2" fill="#FF5252" />
        <circle cx="12" cy="12" r="2" fill="#4CAF50" />
        <circle cx="16" cy="16" r="2" fill="${accentColor}" />
        <path d="M4,20 L20,4" stroke="${secondaryColor}" stroke-width="1.5" />
      `);
      
    case 'calculator':
      return wrapSVG(`
        <rect x="4" y="2" width="16" height="20" rx="2" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <rect x="6" y="4" width="12" height="4" fill="#E0E0E0" stroke="${baseStroke}" stroke-width="0.5" />
        <circle cx="8" cy="11" r="1.2" fill="${accentColor}" />
        <circle cx="12" cy="11" r="1.2" fill="${accentColor}" />
        <circle cx="16" cy="11" r="1.2" fill="${accentColor}" />
        <circle cx="8" cy="15" r="1.2" fill="${accentColor}" />
        <circle cx="12" cy="15" r="1.2" fill="${accentColor}" />
        <circle cx="16" cy="15" r="1.2" fill="${accentColor}" />
        <circle cx="8" cy="19" r="1.2" fill="${accentColor}" />
        <circle cx="12" cy="19" r="1.2" fill="${accentColor}" />
        <circle cx="16" cy="19" r="1.2" fill="${secondaryColor}" />
      `);
      
    case 'myComputer':
      return wrapSVG(`
        <rect x="4" y="6" width="16" height="12" rx="1" fill="${accentColor}" stroke="${baseStroke}" stroke-width="0.5" />
        <rect x="7" y="9" width="10" height="6" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <rect x="8" y="18" width="8" height="2" fill="#aaa" stroke="${baseStroke}" stroke-width="0.5" />
      `);
      
    case 'recycle':
      return wrapSVG(`
        <path d="M12,3 L16,8 L8,8 Z" fill="${accentColor}" stroke="${baseStroke}" stroke-width="0.5" />
        <path d="M5,10 L9,15 L1,15 Z" fill="${accentColor}" stroke="${baseStroke}" stroke-width="0.5" transform="rotate(15 5 12)" />
        <path d="M19,10 L23,15 L15,15 Z" fill="${accentColor}" stroke="${baseStroke}" stroke-width="0.5" transform="rotate(-15 19 12)" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="${baseStroke}" stroke-width="0.7" stroke-dasharray="1,1" />
      `);
      
    case 'startButton':
      return wrapSVG(`
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#0078D7" stroke="${baseStroke}" stroke-width="0.5" />
        <rect x="4" y="4" width="8" height="8" fill="${baseFill}" />
        <rect x="12" y="4" width="8" height="8" fill="${baseFill}" />
        <rect x="4" y="12" width="8" height="8" fill="${baseFill}" />
        <rect x="12" y="12" width="8" height="8" fill="${baseFill}" />
      `);
      
    default:
      return wrapSVG(`
        <rect x="3" y="3" width="18" height="18" rx="2" fill="${baseFill}" stroke="${baseStroke}" stroke-width="0.5" />
        <text x="12" y="15" font-size="10" text-anchor="middle" fill="${baseStroke}">?</text>
      `);
  }
}

// List of all icon types to generate
const iconTypes = [
  'browser',
  'youtube',
  'videoPlayer',
  'googleMaps',
  'notepad',
  'paint',
  'calculator',
  'myComputer',
  'recycle',
  'startButton'
];

// Create directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/images/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log(`Created directory: ${iconsDir}`);
}

// Generate and save each icon
iconTypes.forEach(iconType => {
  const svgContent = generateIconSVG(iconType, 32);
  const filePath = path.join(iconsDir, `${iconType}.svg`);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated icon: ${filePath}`);
});

console.log('Icon generation complete!'); 