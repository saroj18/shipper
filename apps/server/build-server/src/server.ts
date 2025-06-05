import { server } from './app.js';
import dotenv from 'dotenv';
import { MongoDBConnection, MySQLConnection } from '@repo/database';
import { ENV } from './ENV-Config.js';
import { runQueueJob } from './worker.js';
dotenv.config();

MySQLConnection.getInstance()
  .then(() => {
    MongoDBConnection.getInstance().then(async () => {
      server.listen(ENV.PORT, () => {
        console.log('database and server started successfully at port', ENV.PORT);
      });
      await runQueueJob();
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
