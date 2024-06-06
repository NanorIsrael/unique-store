import { NextFunction, Request, Response } from "express";

import NotAuthorisedError from "../common/error-handlers/unauthorised";

export default class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const { userId } = body;

      if (!userId) {
        throw new NotAuthorisedError();
      }
      res.status(200).json({ message: "orderCreated" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
