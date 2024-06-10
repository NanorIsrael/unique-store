import { NextFunction, Request, Response } from "express";
import BadRequestError from "../../common/error-handlers/badrequest";
import AdminService from "./admin.service";

class UserController {
  static async findAndCreateAdminUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.body;

      const service = new AdminService();
      const existingUser = await service.findAdminById(userId);
      if (existingUser) {
        return existingUser;
      }

      const userDoc = await service.createAdmin(userId);
      res.status(201).json(userDoc);
    } catch (err) {
      next(err);
    }
  }

  static async getAllAdminUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const service = new AdminService();
      const users = await service.getAllAdminUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getAdminUserByID(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new BadRequestError("Invalid 'user id' parameter");
      }
      const service = new AdminService();
      const user = await service.findAdminById(userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async deleteAdminUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new BadRequestError("invalid 'admin id' parameter");
      }
      const service = new AdminService();
      const adminUser = await service.deletAdminById(userId);
      if (!adminUser) {
        throw new BadRequestError(`user with id: ${userId} does not exist.`);
      }
      res.status(200).json(adminUser);
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
