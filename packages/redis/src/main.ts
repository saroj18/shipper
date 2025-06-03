import Redis from 'ioredis';

export class CacheProvider {
  private constructor() {}
  private static instance: Redis;

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
}
