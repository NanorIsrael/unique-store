import { Types } from "mongoose";
import dataSource from "../utils";
import { CreateUserDto } from "./user.dto";
import User, { UserDoc } from "./user.schema";

export interface SecuredUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IUserService {
  createUser(user: CreateUserDto): Promise<UserDoc>;
  findUserByIdOrEmail(data: {
    [key: string]: string | Types.ObjectId;
  }): Promise<UserDoc | null>;
  getAllUsers(
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    data: SecuredUser[];
  }>;
  updateUser(
    userId: Types.ObjectId | string,
    user: Partial<CreateUserDto>,
  ): Promise<UserDoc | null>;
  deletUserById(userId: string | Types.ObjectId): Promise<UserDoc | null>;
}

export default class UserService implements IUserService {
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
    data: SecuredUser[];
  }> {
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);
    const users = await User.find().skip(skip).limit(limit);
    const data = users.map((obj) => ({
      _id: obj._id,
      name: obj.name,
      email: obj.email,
      createdAt: obj.created_at,
    }));
    return { page, limit, total, pages, data };
  }

  async deletUserById(
    userId: string | Types.ObjectId,
  ): Promise<UserDoc | null> {
    return await User.findByIdAndDelete({ _id: userId });
  }

  async updateUser(
    userId: Types.ObjectId | string,
    user: Partial<CreateUserDto>,
  ): Promise<UserDoc | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return updatedUser as UserDoc;
  }
}
export const userService = new UserService();
