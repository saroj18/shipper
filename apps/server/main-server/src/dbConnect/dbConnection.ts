import { MongoDBConnection } from "@repo/database";

export const connectDB = async () => {
  try {
    await MongoDBConnection.getInstance();
  } catch (error: any) {
    throw new Error("Failed to connect to the database" + error.message);
  }
};
