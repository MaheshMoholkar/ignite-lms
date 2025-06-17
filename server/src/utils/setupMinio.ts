import { Client } from "minio";
import { BUCKETS } from "./minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || "minioadmin",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "miniosecret",
});

async function setupMinioBuckets() {
  try {
    // Create buckets if they don't exist
    for (const bucketName of Object.values(BUCKETS)) {
      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName);
        console.log(`Created bucket: ${bucketName}`);
      }
    }

    // Set public access policy for both buckets
    const profileImagesPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKETS.PROFILE_IMAGES}/*`],
        },
      ],
    };

    const thumbnailsPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKETS.COURSE_THUMBNAILS}/*`],
        },
      ],
    };

    // Apply policy to both buckets
    await minioClient.setBucketPolicy(
      BUCKETS.PROFILE_IMAGES,
      JSON.stringify(profileImagesPolicy)
    );
    await minioClient.setBucketPolicy(
      BUCKETS.COURSE_THUMBNAILS,
      JSON.stringify(thumbnailsPolicy)
    );

    console.log("Successfully set up MinIO buckets with public access");
  } catch (error) {
    console.error("Error setting up MinIO buckets:", error);
    throw error;
  }
}

export default setupMinioBuckets;
