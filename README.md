# CMR Vision

A WebXR AR application inspired by Apple Vision Pro, built with React, Three.js, React Three Fiber, and WebXR.

## Features

The application includes 5 virtual applications that can be used in an AR environment:

1. **Video Player** - Play local video files in AR space
2. **YouTube** - Watch YouTube videos using embedded iframes
3. **Google Maps** - Explore locations using Google Maps
4. **Browser** - Browse the web with a simple browser interface
5. **GitHub** - Access GitHub through an embedded view

## Technology Stack

- React + TypeScript
- Three.js
- React Three Fiber
- WebXR
- Zustand (for state management)

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open the application in a WebXR-capable browser

## WebXR Requirements

This application requires:
- A WebXR-compatible browser (Chrome, Edge, Firefox with WebXR flags enabled)
- For AR: A compatible AR-capable device (Android with ARCore, iOS with WebXR Viewer)
- For VR: A compatible VR headset (Oculus Quest, HTC Vive, etc.)

## Project Structure

- `/src/components` - Core UI components
- `/src/apps` - Individual application components
- `/src/stores` - State management with Zustand
- `/src/contexts` - React contexts for shared state

## Notes on Google Maps

To use the Google Maps functionality, you'll need to replace `YOUR_API_KEY` in the GoogleMapsApp.tsx file with a valid Google Maps API key.

## License

MIT