import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
  useSSL: process.env.NODE_ENV === "production",
  accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "miniosecret",
});

// Bucket names from environment variables
const BUCKETS = {
  PROFILE_IMAGES: process.env.MINIO_PROFILE_BUCKET || "ignite-profile-images",
  COURSE_THUMBNAILS: process.env.MINIO_THUMBNAIL_BUCKET || "ignite-thumbnails",
  COURSE_VIDEOS: process.env.MINIO_VIDEO_BUCKET || "ignite-course-videos",
  LAYOUT_BANNERS: process.env.MINIO_BANNER_BUCKET || "ignite-layout-banners",
};

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Allowed video types
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
];

// Upload a file (image or video)
async function uploadFile(
  file: Buffer,
  fileName: string,
  mimeType: string,
  bucketName: string
) {
  try {
    // Validate file type based on bucket
    if (bucketName === BUCKETS.COURSE_VIDEOS) {
      if (!ALLOWED_VIDEO_TYPES.includes(mimeType)) {
        throw new Error(
          "Invalid file type. Only MP4, WebM, OGG, MOV, AVI and WMV videos are allowed."
        );
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed."
        );
      }
    }

    // Generate unique filename
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Upload to MinIO
    await minioClient.putObject(bucketName, uniqueFileName, file);

    // Return permanent public URL with proper protocol and port
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = process.env.MINIO_URI || `${protocol}://localhost:9000`;
    const publicUrl = `${baseUrl}/${bucketName}/${uniqueFileName}`;

    return {
      public_id: uniqueFileName,
      url: publicUrl,
    };
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// Delete a file
async function deleteFile(fileName: string, bucketName: string) {
  try {
    await minioClient.removeObject(bucketName, fileName);
  } catch (error: any) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

export {
  uploadFile,
  deleteFile,
  BUCKETS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
};
