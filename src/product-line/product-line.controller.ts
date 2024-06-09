import { NextFunction, Request, Response } from "express";

import BadRequestError from "../common/error-handlers/badrequest";
import { ProductLineService } from "./product-line.service";

export default class ProductLineController {
  static async getProductLineById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"];
      if (!id) {
        throw new BadRequestError("order id required");
      }

      const productLineService = new ProductLineService();
      const productLine = await productLineService.getProductLineById(id);
      res.status(200).json(productLine);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductLinePaginated(
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

      const productLineService = new ProductLineService();
      const productLine = await productLineService.getAllProductLines();
      res.status(200).json(productLine);
    } catch (error) {
      next(error);
    }
  }
}
