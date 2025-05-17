import { server } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./dbConnect/dbConnection.js";
import { ENV } from "./ENV-Config.js";
dotenv.config();

const dbConfig = {
  db_host: ENV.DB_HOST,
  db_user: ENV.DB_USER,
  db_password: ENV.DB_PASSWORD,
  db_name: ENV.DB_NAME,
};

connectDB(dbConfig)
  .then(() => {
    server.listen(ENV.PORT, () => {
      console.log("database and server started successfully at port", ENV.PORT);
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
