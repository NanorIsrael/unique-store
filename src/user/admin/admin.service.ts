import { Types } from "mongoose";
import dataSource from "../../utils";
import Admin, { AdminDoc } from "./admin.schema";

export default class AdminService {
  constructor() {
    dataSource.getDBConection();
  }

  async createAdmin(userId: string | Types.ObjectId): Promise<AdminDoc> {
    const newUser = new Admin({ user_id: userId });
    return newUser.save();
  }

  async findAdminById(
    userId: string | Types.ObjectId,
  ): Promise<AdminDoc | null> {
    return await Admin.findById(userId);
  }

  async getAllAdminUsers(): Promise<AdminDoc[]> {
    const adminUsers = await Admin.find({});
    return adminUsers;
  }

  async deletAdminById(
    userId: string | Types.ObjectId,
  ): Promise<AdminDoc | null> {
    return await Admin.findByIdAndDelete({ _id: userId });
  }
}
export const userService = new AdminService();
