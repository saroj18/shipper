import dotenv from "dotenv";
import { connectDB } from "./dbConnect/dbConnection.js";
import { server } from "./app.js";
dotenv.config();

// const dbConfig = {
//   db_host: ENV.DB_HOST,
//   db_user: ENV.DB_USER,
//   db_password: ENV.DB_PASSWORD,
//   db_name: ENV.DB_NAME,
// };

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
