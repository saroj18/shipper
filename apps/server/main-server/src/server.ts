import dotenv from "dotenv";
import { connectDB } from "./dbConnect/dbConnection.js";
import { server } from "./app.js";
dotenv.config();


connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(
        "database and server started successfully at port",
        process.env.PORT
      );
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
