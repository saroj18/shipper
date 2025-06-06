import Redis from 'ioredis';
import { SocketProvider } from '@repo/socket';

export class CacheProvider {
  private constructor() {}
  private static instance: Redis;
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
        SocketProvider.emitEvent(parsedMessage.userId, 'server_logs', parsedMessage.payload);
      } else if (channel === 'build_status') {
        SocketProvider.emitEvent(parsedMessage.userId, 'build_status', parsedMessage.payload);
      } else if (channel === 'build_logs') {
        SocketProvider.emitEvent(parsedMessage.userId, 'build_logs', parsedMessage.payload);
      }
    });
  }
}
