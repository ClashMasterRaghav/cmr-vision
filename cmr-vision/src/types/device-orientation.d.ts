interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<string>;
}

interface DeviceOrientationEventStatic {
  prototype: DeviceOrientationEvent;
  requestPermission?(): Promise<string>;
}

// Add iOS-specific properties to the global Window interface
interface Window {
  DeviceOrientationEvent: DeviceOrientationEventStatic;
} 