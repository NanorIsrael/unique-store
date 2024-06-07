import { IUser } from "./user.schema";
import UserService, { IUserService } from "./user.service";

describe("UserService", () => {
  let testUser: IUser;
  let service: IUserService;

  beforeEach(async () => {
    service = new UserService();

    testUser = {
      email: "george.bluth@reqres.in",
      name: "George",
      password: "Bluth@360",
      created_at: new Date(),
    };
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const result = await service.createUser(testUser as IUser);
    expect(result).toBeDefined();
    expect(result.email).toEqual(testUser.email);
    expect(result.password).not.toEqual(testUser.password);
  });

  it("should get all users", async () => {
    await service.createUser(testUser as IUser);

    const result = await service.getAllUsers(1, 10);
    console.log(result);

    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it("should find user by id", async () => {
    const user = await service.createUser(testUser as IUser);

    const result = await service.findUserByIdOrEmail({ userId: user._id });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id");
    expect(result?._id).toEqual(user._id);
  });

  it("should delet user by id", async () => {
    const user = await service.createUser(testUser as IUser);

    const result = await service.deletUserById(user._id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id");
    expect(result?._id).toEqual(user._id);
  });
});
