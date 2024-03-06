import mongoose from "mongoose";

let isConnected = false;

export async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to mongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "IntelliNote",
    });
    isConnected = true;
    console.log("Connected to mongoDB");
  } catch (error) {
    if (error instanceof Error)
      console.log("Failed to connect to DB:", error.message);
  }
}
