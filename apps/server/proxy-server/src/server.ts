import dotenv from "dotenv";
import { server } from "./app.js";
import { connectDB } from "./dbConnect/dbConnection.js";
dotenv.config();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(
        "database and server started successfully at port",
        process.env.PORT||8000
      );
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
