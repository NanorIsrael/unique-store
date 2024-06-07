import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { CreateUserDto, LoginUserDto } from "./user.dto";
import UserService, { IUserService } from "./user.service";
import { Types } from "mongoose";

import TokenService, { token } from "../auth/auth-token-service";
import { getAuthHeader } from "../common/auth";
import BadRequestError from "../common/error-handlers/badrequest";
import RequestValidationError from "../common/error-handlers/validation";
import redisClient from "../common/redis";

class UserController {
  static async findAndCreateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, email, password } = req.body;

      const userData = new CreateUserDto(email, name, password);
      const errors = await validate(userData);

      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      } else {
        const service: IUserService = new UserService();
        const existingUser = await service.findUserByIdOrEmail({
          email,
        });
        if (existingUser) {
          throw new BadRequestError("email is in use.");
        }
        const userDoc = await service.createUser(userData);
        res.status(201).json({ email: userDoc.email });
      }
    } catch (err) {
      next(err);
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
        const service: IUserService = new UserService();
        const existingUser = await service.findUserByIdOrEmail({
          email,
        });
        if (!existingUser) {
          throw new BadRequestError("user does not exists!");
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
          throw new BadRequestError("wrong password.");
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async resetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const expiredAccessToken = req.body["accessToken"];

      if (!expiredAccessToken) {
        throw new BadRequestError("access token required.");
      }
      const refreshToken = getAuthHeader(req.headers);
      if (!refreshToken) {
        throw new BadRequestError("header must include authorization");
      }

      const tokenService = new TokenService();
      const userId = await tokenService.verifyToken(
        refreshToken,
        token.REFRESH_TOKEN,
      );
      if (!userId) {
        throw new BadRequestError("refresh token invalid");
      }
      const ownerId = await redisClient.get(expiredAccessToken);
      if (!ownerId) {
        throw new BadRequestError("access token is invalid.");
      }
      await redisClient.del(expiredAccessToken);
      const newTokens = await tokenService.createTokens(userId);
      return res.status(200).json(newTokens);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default UserController;
