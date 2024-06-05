import mongoose from "mongoose";

beforeAll(async () => {
  try {
    const mongouri = process.env.MONGO_URI_TEST as string;
    await mongoose.connect(mongouri);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.drop();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
