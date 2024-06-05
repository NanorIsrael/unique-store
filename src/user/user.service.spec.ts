import { UserDoc } from "./user-schema";
import UserService, { IUserService } from "./user-service";

describe("UserService", () => {
  let testUser: Partial<UserDoc>;
  let service: IUserService;

  beforeEach(async () => {
    service = new UserService();

    testUser = {
      email: "george.bluth@reqres.in",
      name: "George",
      password: "Bluth@360",
    };
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user", async () => {
    const result = await service.createUser(testUser as UserDoc);
    expect(result).toBeDefined();
    expect(result.email).toEqual(testUser.email);
    expect(result.password).not.toEqual(testUser.password);
  });
});
