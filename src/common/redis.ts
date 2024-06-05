import { createClient, RedisClientType } from "redis";

export interface IRedis {
  isAlive(): boolean;

  get(value: string): Promise<string | null>;
  set(key: string, value: string, expires: number): void;
  del(key: string): Promise<number>;
  close(): void;
}

class RedisClient implements IRedis {
  client: RedisClientType;
  isConnected: boolean;

  constructor() {
    this.client = createClient({
      url: "redis://localhost:6379",
    });
    this.isConnected = false;

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
    this.client.on("connect", async () => {
      // await this.client.connect();
      this.isConnected = true;
    });
    this.client.connect();
  }

  isAlive() {
    return this.isConnected;
  }

  async get(value: string) {
    return await this.client.get(value);
  }

  async set(key: string, value: string, expires: number) {
    await this.client.setEx(key, expires, value);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async close() {
    await this.client.disconnect();
  }
}
const redisClient = new RedisClient();
export default redisClient;
