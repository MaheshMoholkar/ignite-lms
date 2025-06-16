import mongoose from "mongoose";

require("dotenv").config();

const dbUrl: string = process.env.MONGO_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connect with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message, error);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
