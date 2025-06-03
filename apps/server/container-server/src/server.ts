import dotenv from 'dotenv';
import { ENV } from '@repo/utils';
import { app } from './app.js';
dotenv.config();
import { MongoDBConnection } from '@repo/database';

MongoDBConnection.getInstance()
  .then(() => {
    app.listen(ENV.PORT || 10000, () => {
      console.log('database and server started successfully at port', ENV.PORT || 10000);
    });
  })
  .catch((error: any) => {
    console.log('Error starting server: ', error.message);
    process.exit(1);
  });
