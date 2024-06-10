import { NextFunction, Request, Response } from "express";
import BadRequestError from "../../common/error-handlers/badrequest";
import AdminService from "./admin.service";
import { CreateAdminUserDto } from "./admin.dto";
import { validate } from "class-validator";
import RequestValidationError from "../../common/error-handlers/validation";
import UserService from "../user.service";

class AdminUserController {
  static async findAndCreateAdminUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;

      const adminCreateDto = new CreateAdminUserDto(email);
      const errors = await validate(adminCreateDto);
      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      }
      const existingUser = await new UserService().findUserByIdOrEmail({
        email,
      });
      if (!existingUser) {
        throw new BadRequestError(`user with email: ${email} does not exist.`);
      }
      const service = new AdminService();
      const existingAdminUser = await service.findAdminByUserId(
        existingUser._id,
      );
      if (existingAdminUser) {
        return res.status(201).json(existingAdminUser);
      }

      const userDoc = await service.createAdmin(existingUser._id);
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
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("user id required.");
      }

      const service = new AdminService();
      const adminUser = await service.deletAdminById(id as string);
      if (!adminUser) {
        throw new BadRequestError(`user with id: ${id} does not exist.`);
      }
      res.status(200).json(adminUser);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminUserController;
