import { Server, Socket } from 'socket.io';
import http from 'http';
import { UserSchema } from '@repo/database/models/user.model';
import { CacheProvider } from '@repo/redis';
import { createAdapter } from '@socket.io/redis-adapter';
import cookie from 'cookie';

export class SocketProvider {
  private static instance: Server;

  private constructor() {}

  public static async getInstance(server: http.Server): Promise<Server> {
    if (!this.instance) {
      this.instance = new Server(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      const pubClient = CacheProvider.getInstance();
      const subClient = pubClient.duplicate();
      this.instance.adapter(createAdapter(pubClient, subClient));

      this.instance.on('connection', async (socket: Socket) => {
        try {
          const cookies = socket.handshake.headers.cookie || '';
          const parsedCookies = cookie.parse(cookies);
          const { accessToken } = parsedCookies;

          if (!accessToken) {
            console.warn('Missing accessToken. Disconnecting socket.');
            return socket.disconnect(true);
          }

          let payload;
          try {
            payload = UserSchema.verifyAccessToken(accessToken);
          } catch (err) {
            console.warn('Invalid token. Disconnecting socket.');
            return socket.disconnect(true);
          }

          const userId = payload.id.toString();
          console.log(`User ${userId} connected with socket ${socket.id}`);

          // Store socket ID under user ID
          await CacheProvider.saveDataOnCache(userId, socket.id);

          socket.on('disconnect', async () => {
            console.log(`User ${userId} disconnected`);
            const existingSocketId = await CacheProvider.getDataFromCache(userId);
            if (existingSocketId === socket.id) {
              await CacheProvider.deleteFromCache(userId);
            }
          });
        } catch (err) {
          console.error('Error in socket connection:', err);
          socket.disconnect(true);
        }
      });
    }

    return this.instance;
  }

  public static async listenEvent(
    userId: string,
    event: string,
    callback: (data: any) => void
  ): Promise<void> {
    const socketId = await CacheProvider.getDataFromCache(userId);
    if (!socketId) throw new Error('Socket ID not found for user');

    const socket = this.instance.sockets.sockets.get(socketId);
    if (!socket) throw new Error('Socket not active on this instance');

    socket.on(event, callback);
  }

  public static async emitEvent(userId: string, event: string, payload: any): Promise<void> {
    const socketId = await CacheProvider.getDataFromCache(userId);
    if (!socketId) throw new Error('Socket ID not found for user');

    this.instance.to(socketId).emit(event, payload);
  }

  public static emitEventForAllClients(event: string, payload: any): void {
    this.instance.emit(event, payload);
  }
}
