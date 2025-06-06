import dotenv from 'dotenv';
import { ENV } from '@repo/utils';
import { server } from './app.js';
dotenv.config();
import { MongoDBConnection } from '@repo/database';
import { SocketProvider } from '@repo/socket';
import { CacheProvider } from '@repo/redis';

MongoDBConnection.getInstance()
  .then(async () => {
    SocketProvider.getInstance(server);
    server.listen(ENV.PORT || 10000, () => {
      console.log('database and server started successfully at port', ENV.PORT || 10000);
    });
    await CacheProvider.subscribeToChannel('server_logs');
  })
  .catch((error: any) => {
    console.log('Error starting server: ', error.message);
    process.exit(1);
  });
