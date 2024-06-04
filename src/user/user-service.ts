import CreateUserDto from "./user-dto";
import User, { UserDoc } from "./user-schema";

export interface IUserService {
  createUser(user: CreateUserDto): Promise<UserDoc>;
}

export default class UserService {
  constructor() {}

  async createUser(user: CreateUserDto): Promise<UserDoc> {
    // name: string, email: string, password: string
    const newUser = new User(user);
    return newUser.save();
  }
}
