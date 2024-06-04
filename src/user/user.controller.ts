import { validate } from "class-validator";
import { Request, Response } from "express";
import CreateUserDto from "./user-dto";
import UserService, { IUserService } from "./user-service";
import dataSource from "../utils";
import User, { UserDoc } from "./user-schema";

class UserController {
  private static async findUserByIdOrEmail(data: {
    [key: string]: string;
  }): Promise<UserDoc | null> {
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
        res.json({ email: userDoc.email });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
      }
    }
  }
}
export default UserController;
