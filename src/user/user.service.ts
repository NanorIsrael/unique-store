import dataSource from "../utils";
import { CreateUserDto } from "./user.dto";
import User, { IUser, UserDoc } from "./user.schema";

export interface IUserService {
  createUser(user: CreateUserDto): Promise<UserDoc>;
  findUserByIdOrEmail(data: { [key: string]: string }): Promise<IUser | null>;
  getAllUsers(
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    data: UserDoc[];
  }>;
}

export default class UserService {
  constructor() {
    dataSource.getDBConection();
  }

  async createUser(user: CreateUserDto): Promise<UserDoc> {
    const newUser = new User(user);
    return newUser.save();
  }

  async findUserByIdOrEmail(data: {
    [key: string]: string;
  }): Promise<UserDoc | null> {
    if (data.hasOwnProperty("email")) {
      return await User.findOne({ email: data["email"] });
    }

    return await User.findById(data["userId"]);
  }

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    data: UserDoc[];
  }> {
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await User.find().skip(skip).limit(limit);
    return { page, limit, total, pages, data };
  }
}
export const userService = new UserService();
