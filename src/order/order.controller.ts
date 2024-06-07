import { NextFunction, Request, Response } from "express";

import { OrderService } from "./order.service";
import OrderDto from "./order.dto";
import { validate } from "class-validator";
import RequestValidationError from "../common/error-handlers/validation";

export default class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, productLine } = req.body;

      const orderDto = new OrderDto(productLine, userId);
      const errors = await validate(orderDto);
      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      }

      const orderService = new OrderService();
      const order = await orderService.createOrder(orderDto);

      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
