import { getSequelizeInstance } from "../models/index.js";
import { MySQLConnection } from "@repo/database";

export const connectDB = async () => {
  try {
    const dbInstance = await MySQLConnection.getInstance();
    await getSequelizeInstance(dbInstance);
  } catch (error: any) {
    throw new Error("Failed to connect to the database" + error.message);
  }
};
