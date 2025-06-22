import { app } from "./app";
import connectDB from "./utils/db";
import setupMinioBuckets from "./utils/setupMinio";
require("dotenv").config();

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Setup MinIO buckets
    //await setupMinioBuckets();

    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
