import multer from "multer";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "../utils/minio";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed!"));
  }
};

// File filter for videos only
const videoFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only video files (MP4, WebM, OGG, MOV, AVI, WMV) are allowed!")
    );
  }
};

// File filter for both images and videos
const mediaFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    ALLOWED_IMAGE_TYPES.includes(file.mimetype) ||
    ALLOWED_VIDEO_TYPES.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"));
  }
};

// Configure multer upload for images
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Configure multer upload for videos
const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
});

// Configure multer upload for media (images and videos)
const uploadMedia = multer({
  storage: storage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
});

// Legacy upload (images only) - keeping for backward compatibility
const upload = uploadImage;

export default upload;
export { uploadImage, uploadVideo, uploadMedia };
