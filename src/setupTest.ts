import mongoose from "mongoose";

jest.mock("./utils");

beforeAll(async () => {
  try {
    const mongouri = process.env.MONGO_URI as string;
    await mongoose.connect(mongouri);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
});

afterEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    try {
      await collection.drop();
    } catch (error: any) {
      if (error.message !== "ns not found") {
        throw error;
      }
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
