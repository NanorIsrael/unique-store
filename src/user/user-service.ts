import dataSource from "../utils";
import { CreateUserDto } from "./user-dto";
import User, { IUser, UserDoc } from "./user-schema";

export interface IUserService {
  createUser(user: CreateUserDto): Promise<UserDoc>;
  findUserByIdOrEmail(data: { [key: string]: string }): Promise<IUser | null>;
}

export default class UserService {
  constructor() {
    dataSource.getDBConection();
  }

  async createUser(user: CreateUserDto): Promise<UserDoc> {
    // name: string, email: string, password: string
    const newUser = new User(user);
    return newUser.save();
  }

  async findUserByIdOrEmail(data: {
    [key: string]: string;
  }): Promise<IUser | null> {
    await dataSource.getDBConection();
    if (data.hasOwnProperty("email")) {
      return await User.findOne({ email: data["email"] });
    }

    return await User.findById(data["userId"]);
  }
}
