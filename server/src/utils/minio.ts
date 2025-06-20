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
  LAYOUT_BANNERS: process.env.MINIO_BANNER_BUCKET || "ignite-layout-banners",
};

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

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

    // Return permanent public URL with proper protocol and port
    const baseUrl = process.env.MINIO_URI || "http://localhost:9000";
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

export { uploadFile, deleteFile, BUCKETS };
