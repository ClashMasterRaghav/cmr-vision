/**
 * Utility functions for dealing with assets in Vite
 */

/**
 * Gets the full URL for an asset in the public directory
 * This is useful for Vite's asset handling
 * 
 * @param path The path to the asset relative to the public directory
 * @returns The full URL to use in src attributes
 */
export function getPublicAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return new URL(`/${cleanPath}`, import.meta.url).href;
}

/**
 * Gets the current base URL from Vite's environment
 * @returns The base URL of the application
 */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Builds a full asset path by combining the base URL with the asset path
 * @param path The path to the asset
 * @returns The full URL including the base path
 */
export function getAssetPath(path: string): string {
  const base = getBaseUrl();
  // Remove leading slash from path if present and ensure base has trailing slash
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
} 