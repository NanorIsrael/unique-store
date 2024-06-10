import { RedisClientType, createClient } from "redis";

describe("Redis Service", () => {
  let client: RedisClientType;
  let isConnected: boolean;

  beforeEach(async () => {
    client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    isConnected = false;

    client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
    client.on("connect", (err) => {
      isConnected = true;
    });

    await client.connect();
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it("should be defined", () => {
    expect(client.isOpen).toBeTruthy();
    expect(client).toBeTruthy();
    expect(isConnected).toBeTruthy();
  });
});
