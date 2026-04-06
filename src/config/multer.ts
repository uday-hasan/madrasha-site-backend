import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
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
};

// General upload — images or videos, single file
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.UPLOAD_LIMIT,
  },
});

// Image-only uploader
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
    fileSize: 10 * 1024 * 1024, // 10MB for images
  },
});

// Video-only uploader
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
    fileSize: env.UPLOAD_LIMIT,
  },
});
