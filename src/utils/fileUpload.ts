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
export const urlToFilePath = (url: string): string => {
  return path.join(env.UPLOAD_DIR, url.replace(/^\/uploads\//, ''));
};

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
export const getFullUrl = (urlPath: string): string => {
  if (urlPath.startsWith('http')) {
    return urlPath; // Already a full URL
  }
  return `${env.BASE_URL}${urlPath}`;
};
