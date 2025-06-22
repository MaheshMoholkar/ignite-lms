import { Client } from "minio";
import { BUCKETS } from "./minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: 9000,
  useSSL: process.env.NODE_ENV === "production",
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

    // Set public access policy for buckets
    const publicPolicy = (bucket: string) => ({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });

    for (const bucketName of Object.values(BUCKETS)) {
      await minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify(publicPolicy(bucketName))
      );
    }

    console.log("Successfully set up MinIO buckets with public access");
  } catch (error) {
    console.error("Error setting up MinIO buckets:", error);
    throw error;
  }
}

export default setupMinioBuckets;
