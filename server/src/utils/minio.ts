import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "miniosecret",
});

// Bucket names from environment variables
const BUCKETS = {
  PROFILE_IMAGES: process.env.MINIO_PROFILE_BUCKET || "ignite-profile-images",
  COURSE_THUMBNAILS: process.env.MINIO_THUMBNAIL_BUCKET || "ignite-thumbnails",
  COURSE_CONTENT: process.env.MINIO_CONTENT_BUCKET || "ignite-content",
};

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// URL expiration time in seconds (7 days)
const URL_EXPIRATION = 7 * 24 * 60 * 60;

// Generate a pre-signed URL
async function generatePresignedUrl(bucketName: string, fileName: string) {
  try {
    return await minioClient.presignedGetObject(
      bucketName,
      fileName,
      URL_EXPIRATION
    );
  } catch (error: any) {
    throw new Error(`Failed to generate pre-signed URL: ${error.message}`);
  }
}

// Upload a file
async function uploadFile(
  file: Buffer,
  fileName: string,
  mimeType: string,
  bucketName: string
) {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed."
      );
    }

    // Generate unique filename
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Upload to MinIO
    await minioClient.putObject(bucketName, uniqueFileName, file);

    // Generate pre-signed URL
    const url = await generatePresignedUrl(bucketName, uniqueFileName);

    // Return the public URL
    return {
      public_id: uniqueFileName,
      url: url,
      expires_at: Date.now() + URL_EXPIRATION * 1000, // Add expiration timestamp
    };
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// Refresh URL if expired
async function refreshUrlIfNeeded(
  avatar: {
    public_id: string;
    url: string;
    expires_at?: number;
  },
  bucketName: string
) {
  try {
    // If no expiration time or URL is expired (with 5 minutes buffer)
    if (!avatar.expires_at || avatar.expires_at < Date.now() + 5 * 60 * 1000) {
      const newUrl = await generatePresignedUrl(bucketName, avatar.public_id);
      return {
        ...avatar,
        url: newUrl,
        expires_at: Date.now() + URL_EXPIRATION * 1000,
      };
    }
    return avatar;
  } catch (error: any) {
    throw new Error(`Failed to refresh URL: ${error.message}`);
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

export { uploadFile, deleteFile, refreshUrlIfNeeded, BUCKETS };
