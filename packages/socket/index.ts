import { Server, Socket } from 'socket.io';
import http from 'http';
import { UserSchema } from '@repo/database/models/user.model.js';
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
          origin: process.env.SOCKET_ORIGIN || 'http://localhost:5173',
          methods: ['GET', 'POST'],
          credentials: true,
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
          console.log('>>>>>', accessToken);

          if (!accessToken) {
            console.warn('Missing accessToken. Disconnecting socket.');
            return socket.disconnect(true);
          }

          let payload;
          try {
            payload = UserSchema.verifyAccessToken(accessToken);
            console.log('payload', payload);
          } catch (err: any) {
            console.warn('Invalid token. Disconnecting socket.');
            console.log('er>>>', err.message);
            return socket.disconnect(true);
          }
          const userId = payload!.id.toString();
          console.log(`User ${userId} connected with socket ${socket.id}`);

          // Store socket ID under user ID
          await CacheProvider.saveDataOnCache(userId, socket.id);

          socket.on('disconnect', async () => {
            console.log(`User ${userId} disconnected`);
            if (!userId) return;
            const existingSocketId = await CacheProvider.getDataFromCache(userId);
            console.log(`Existing socket ID for user ${userId}:`, existingSocketId);
            if (existingSocketId === socket.id) {
              console.log(`Removing socket ${socket.id} for user ${userId}`);
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
    if (!userId) return;
    const socketId = await CacheProvider.getDataFromCache(userId);
    console.log(`Existing socket ID for user ${userId}:`);
    if (!socketId) throw new Error('Socket ID not found for user');

    const socket = this.instance.sockets.sockets.get(socketId);
    if (!socket) throw new Error('Socket not active on this instance');

    socket.on(event, callback);
  }

  public static async emitEvent(userId: string, event: string, payload: any): Promise<void> {
    console.log('Emitting event:', event, 'to user:', userId);
    if (!userId) return;
    const socketId = await CacheProvider.getDataFromCache(userId);
    console.log('socketId:', socketId);
    console.log(`Existing socket ID for user ${userId}:${socketId}`);
    if (!socketId) throw new Error('Socket ID not found for user');

    this.instance.to(socketId).emit(event, payload);
  }

  public static emitEventForAllClients(event: string, payload: any): void {
    this.instance.emit(event, payload);
  }
}
