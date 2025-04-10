# Hosting on GitHub Pages

Follow these steps to host your AR application on GitHub Pages:

## 1. Create a GitHub Repository

Create a new repository on GitHub if you haven't already.

## 2. Configure Vite for GitHub Pages

Update your `vite.config.ts` file to include the base URL of your GitHub Pages site:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Replace with your actual repository name
})
```

## 3. Build Your Application

Run the build command:

```bash
npm run build
```

This will create a `dist` folder with your built application.

## 4. Deploy to GitHub Pages

You can use GitHub Actions to automate deployment:

1. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

2. Push your code to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Go to your repository Settings > Pages and select the gh-pages branch as the source.

## 5. Configure for AR Usage

When using AR features, remember:
- Your site must be served over HTTPS (GitHub Pages provides this)
- Ensure you have appropriate permissions for camera access in your AR components
- Test on mobile devices directly by visiting your GitHub Pages URL 