import { Redis } from 'ioredis';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import cookie from 'cookie';
import { UserSchema } from '@repo/database/models/user.model.js';

export class CacheProvider {
  private constructor() {}
  private static instance: Redis;
  private static socketInstance: Server;
  private static sub: Redis | null = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Redis({
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      });
    }
    return this.instance;
  }

  public static async getSocketInstance(server: http.Server): Promise<Server> {
    if (!this.instance) {
      this.socketInstance = new Server(server, {
        cors: {
          origin: process.env.SOCKET_ORIGIN || 'http://localhost:5173',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });

      const pubClient = CacheProvider.getInstance();
      const subClient = pubClient.duplicate();
      this.socketInstance.adapter(createAdapter(pubClient, subClient));

      this.socketInstance.on('connection', async (socket: Socket) => {
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
          await this.saveDataOnCache(userId, socket.id);

          socket.on('disconnect', async () => {
            console.log(`User ${userId} disconnected`);
            if (!userId) return;
            const existingSocketId = await this.getDataFromCache(userId);
            console.log(`Existing socket ID for user ${userId}:`, existingSocketId);
            if (existingSocketId === socket.id) {
              console.log(`Removing socket ${socket.id} for user ${userId}`);
              await this.deleteFromCache(userId);
            }
          });
        } catch (err) {
          console.error('Error in socket connection:', err);
          socket.disconnect(true);
        }
      });
    }

    return this.socketInstance;
  }

  public static async emitEvent(userId: string, event: string, payload: any): Promise<void> {
    console.log('Emitting event:', event, 'to user:', userId);
    if (!userId) return;
    const socketId = await this.getDataFromCache(userId);
    console.log('socketId:', socketId);
    console.log(`Existing socket ID for user ${userId}:${socketId}`);
    if (!socketId) throw new Error('Socket ID not found for user');

    this.socketInstance.to(socketId).emit(event, payload);
  }

  public static async listenEvent(
    userId: string,
    event: string,
    callback: (data: any) => void
  ): Promise<void> {
    if (!userId) return;
    const socketId = await this.getDataFromCache(userId);
    console.log(`Existing socket ID for user ${userId}:`);
    if (!socketId) throw new Error('Socket ID not found for user');

    const socket = this.socketInstance.sockets.sockets.get(socketId);
    if (!socket) throw new Error('Socket not active on this instance');

    socket.on(event, callback);
  }

  public static async saveDataOnCache(key: string, value: any) {
    if (!key || !value) {
      throw new Error('please provide key & value for save data');
    }
    const redis = this.getInstance();
    const info = await redis.set(key, JSON.stringify(value));
    return info;
  }

  public static async getDataFromCache(key: string) {
    console.log('key?>>', key);
    if (!key) {
      throw new Error('please provide key first for get data');
    }
    const redis = this.getInstance();
    const data = await redis.get(key);
    return JSON.parse(data as string);
  }

  public static async deleteFromCache(key: string) {
    if (!key) {
      throw new Error('please provide key first for delete data');
    }

    const redis = this.getInstance();
    await redis.del(key);
  }

  public static emitEventForAllClients(event: string, payload: any): void {
    this.socketInstance.emit(event, payload);
  }

  public static async publishToChannel(channel: string, message: any) {
    if (!channel || !message) {
      throw new Error('please provide channel & message for publish data');
    }
    const redis = this.getInstance();
    const info = await redis.publish(channel, JSON.stringify(message));
    return info;
  }

  public static async subscribeToChannel(channel: string) {
    if (!channel) throw new Error('Channel is required for subscribing');

    if (!this.sub) {
      const subscriber = this.getInstance().duplicate();
      this.sub = subscriber;

      await new Promise((resolve, reject) => {
        subscriber.once('ready', resolve);
        subscriber.once('error', reject);
      });
    }

    await this.sub.subscribe(channel);
    this.sub.on('message', (channel, message) => {
      const parsedMessage = JSON.parse(message);
      if (channel === 'server_logs') {
        this.emitEvent(parsedMessage.userId, 'server_logs', parsedMessage.payload);
      } else if (channel === 'build_status') {
        this.emitEvent(parsedMessage.userId, 'build_status', parsedMessage.payload);
      } else if (channel === 'build_logs') {
        this.emitEvent(parsedMessage.userId, 'build_logs', parsedMessage.payload);
      }
    });
  }
}
