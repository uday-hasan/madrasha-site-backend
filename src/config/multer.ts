import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { env } from './env';
import { AppError } from '../utils/AppError';

// ================================
// MULTER CONFIGURATION
// Handles file uploads for images and videos.
// Files are stored locally in the uploads/ directory.
// ================================

// Ensure upload directories exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const imagesDir = path.join(env.UPLOAD_DIR, 'images');
const videosDir = path.join(env.UPLOAD_DIR, 'videos');

ensureDir(imagesDir);
ensureDir(videosDir);

// Disk storage — saves files to the local filesystem
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    cb(null, isVideo ? videosDir : imagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Allowed mime types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];

// Dynamic uploader that checks file type and applies appropriate limits
export const uploadDynamic = (req: Request, res: Response, next: NextFunction) => {
  // Check mediaType from body (form data is parsed by multer first, so req.body may not be fully available)
  // We'll check the actual file's mimetype after upload
  const uploader = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const isVideo = file.mimetype.startsWith('video/');
      const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            `File type ${file.mimetype} is not allowed. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MPEG, QuickTime, WebM) are permitted.`,
            400,
          ),
        );
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max (we'll validate actual limits in the route handler)
    },
  });

  uploader.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const isVideoFile = req.file?.mimetype?.startsWith('video/');
        const maxSize = isVideoFile ? '10MB' : '5MB';
        return next(new AppError(`File too large. Maximum size allowed is ${maxSize}.`, 413));
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

// Image-only uploader (5MB limit) - for specific image routes
export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files (JPEG, PNG, GIF, WebP) are allowed', 400));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for images
  },
});

// Video-only uploader (10MB limit) - for specific video routes
export const uploadVideo = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only video files (MP4, MPEG, QuickTime, WebM) are allowed', 400));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for videos
  },
});

// Keep general upload export for backward compatibility (uses 10MB limit)
export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          `File type ${file.mimetype} is not allowed. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MPEG, QuickTime, WebM) are permitted.`,
          400,
        ),
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB as safe default
  },
});
