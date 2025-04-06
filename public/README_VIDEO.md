# Sample Video

For the Video Player app to work, you need to add a video file named `sample-video.mp4` to this directory.

You can either:
1. Rename one of your existing video files to `sample-video.mp4` and copy it here
2. Download a sample video from the internet and save it as `sample-video.mp4`
3. Or modify the `src` attribute in `src/components/apps/VideoApp.tsx` to point to your video file

Example:
```tsx
videoRef.current.src = '/your-video-file-name.mp4';
``` 