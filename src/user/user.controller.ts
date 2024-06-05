import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { CreateUserDto, LoginUserDto } from "./user-dto";
import UserService, { IUserService } from "./user-service";
import dataSource from "../utils";
import User, { IUser } from "./user-schema";
import TokenService from "../token/token-service";
import { getAuthHeader } from "../common/auth";
import BadRequestError from "../common/error-handlers/badrequest";
import RequestValidationError from "../common/error-handlers/validation";

class UserController {
  private static async findUserByIdOrEmail(data: {
    [key: string]: string;
  }): Promise<IUser | null> {
    await dataSource.getDBConection();
    if (data.hasOwnProperty("email")) {
      return await User.findOne({ email: data["email"] });
    }

    return await User.findById(data["userId"]);
  }

  static async findAndCreateUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userData = new CreateUserDto(email, name, password);
    const errors = await validate(userData);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    } else {
      try {
        const existingUser = await UserController.findUserByIdOrEmail({
          email,
        });
        if (existingUser) {
          return res.status(403).json({ error: "email exists!" });
        }
        const service: IUserService = new UserService();
        const userDoc = await service.createUser(userData);
        res.status(201).json({ email: userDoc.email });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
      }
    }
  }

  static async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      let authData = getAuthHeader(req.headers);
      if (!authData) {
        throw new BadRequestError("header must include authorization");
      }

      authData = Buffer.from(authData, "base64").toString();
      const credentials = authData.split(":");
      const [email, password] = credentials;

      const userData = new LoginUserDto(email, password);
      const errors = await validate(userData);

      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      } else {
        const existingUser = await UserController.findUserByIdOrEmail({
          email,
        });
        if (!existingUser) {
          return res.status(403).json({ error: "user does not exists!" });
        }
        const isValidPassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (isValidPassword) {
          //genrate tokens an save in db
          const token = new TokenService();
          const tokens = await token.createTokens(existingUser._id);
          return res.status(200).json(tokens);
        } else {
          return res.status(401).json({ error: "wrong password." });
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
