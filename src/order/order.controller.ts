import { NextFunction, Request, Response } from "express";

import orderService, { OrderService } from "./order.service";
import OrderDto, { UpdateOrderDto } from "./order.dto";
import { validate } from "class-validator";
import RequestValidationError from "../common/error-handlers/validation";
import BadRequestError from "../common/error-handlers/badrequest";

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

      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"];
      if (!id) {
        throw new BadRequestError("order id required");
      }

      const objectId = id;
      const order = await orderService.findOrderById(objectId);
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"];
      if (!id) {
        throw new BadRequestError("order id required");
      }

      const { userId, productLine } = req.body;

      const orderDto = new UpdateOrderDto(productLine, userId);
      const errors = await validate(orderDto);
      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      }

      const orderService = new OrderService();
      const order = await orderService.updateOrder(id, orderDto);

      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getOrderProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"];
      if (!id) {
        throw new BadRequestError("order id required");
      }

      const products = await orderService.getOrderProducts(id);
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getOrderPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      if (isNaN(page) || page < 1) {
        throw new BadRequestError("Invalid 'page' query parameter");
      }
      if (isNaN(limit) || limit < 1) {
        throw new BadRequestError("Invalid 'limit' query parameter");
      }

      const orders = await orderService.getAllOrdersPagination(page, limit);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrderPaginated(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      if (!id) {
        throw new BadRequestError("user id required.");
      }

      if (isNaN(page) || page < 1) {
        throw new BadRequestError("invalid 'page' query parameter");
      }

      if (isNaN(limit) || limit < 1) {
        throw new BadRequestError("invalid 'limit' query parameter");
      }

      const orders = await orderService.getAllOrdersByUserPagination(
        page,
        limit,
        id,
      );
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
}
