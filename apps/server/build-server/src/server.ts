import dotenv from 'dotenv';
import { connectDB } from './dbConnect/dbConnection.js';
import { server } from './app.js';
import { CacheProvider } from '@repo/redis';
dotenv.config();

connectDB()
  .then(async () => {
    server.listen(process.env.PORT, () => {
      console.log('database and server started successfully at port', process.env.PORT);
    });
    await CacheProvider.subscribeToChannel('build_status');
    await CacheProvider.subscribeToChannel('build_logs');
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
