import mongoose, { Connection, Mongoose } from "mongoose";
import User, { UserDoc } from "./user-schema";
import UserService, { IUserService } from "./user-service";

describe("UserService", () => {
  let testUser: Partial<UserDoc>;
  let connection: Connection;
  let service: IUserService;

  beforeEach(async () => {
    service = UserService;

    testUser = {
      email: "george.bluth@reqres.in",
      name: "George",
      password: "Bluth@360",
    };

    try {
      const mongouri = process.env.MONGO_URI as string;
      const mongooseInstance: Mongoose = await mongoose.connect(mongouri);
      connection = mongooseInstance.connection;
      console.log("Connected to MongoDB");
      return connection;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  });

  afterEach(async () => {
    // jest.clearAllMocks();
    await User.deleteMany({ email: testUser.email });
    await connection.close();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const result = await service.createUser(testUser as UserDoc);
    console.log(result);
    expect(result).toBeDefined();
    expect(result.email).toEqual(testUser.email);
    expect(result.password).not.toEqual(testUser.password);
  });
});
