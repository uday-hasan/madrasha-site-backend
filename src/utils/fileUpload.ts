import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

// ================================
// FILE UPLOAD UTILITIES
// Helpers for managing uploaded files.
// ================================

/**
 * Delete a file from the filesystem.
 * Silently ignores errors if the file doesn't exist.
 */
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-critical — log in calling code if needed
  }
};

/**
 * Convert a local file path to a public URL path.
 * e.g. "./uploads/images/123.jpg" → "/uploads/images/123.jpg"
 */
export const filePathToUrl = (filePath: string): string => {
  // Normalize to forward slashes and remove leading "./"
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  return `/${normalized}`;
};

/**
 * Convert a public URL path back to a local file path.
 * e.g. "/uploads/images/123.jpg" → "./uploads/images/123.jpg"
 */
// export const urlToFilePath = (url: string): string => {
//   return path.join(env.UPLOAD_DIR, url.replace(/^\/uploads\//, ''));
// };

/**
 * Get the public URL for an uploaded file from its multer file object.
 */
export const getFileUrl = (file: Express.Multer.File): string => {
  // file.path is the full disk path — convert to a URL-friendly path
  const relative = path.relative(process.cwd(), file.path);
  return filePathToUrl(relative);
};

/**
 * Get the full URL with base URL for an uploaded file.
 * e.g. "/uploads/images/123.jpg" → "http://localhost:5000/uploads/images/123.jpg"
 */
export const getFullFileUrl = (file: Express.Multer.File): string => {
  const url = getFileUrl(file);
  return `${env.BASE_URL}${url}`;
};

/**
 * Convert a relative URL path to a full URL with base URL.
 * e.g. "/uploads/images/123.jpg" → "http://localhost:5000/uploads/images/123.jpg"
 */
// export const getFullUrl = (urlPath: string): string => {
//   if (urlPath.startsWith('http')) {
//     return urlPath; // Already a full URL
//   }
//   return `${env.BASE_URL}${urlPath}`;
// };

export const urlToFilePath = (fullUrl: string): string | null => {
  // If the URL starts with our backend URL, it's a local file
  if (fullUrl.startsWith(env.BACKEND_URL)) {
    // Remove the base URL to get the relative path (e.g., /uploads/images/file.jpg)
    const relativePath = fullUrl.replace(env.BACKEND_URL, '');
    // Your deleteFile function expects a path relative to the project root
    // e.g., 'public/uploads/images/file.jpg' or just 'uploads/images/file.jpg'
    // depending on your express.static setup.
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  }
  return null; // It's an external link (YouTube/FB), no file to delete
};

export const getFullUrl = (relativePath: string) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath; // Already a URL
  return `${env.BACKEND_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
};
