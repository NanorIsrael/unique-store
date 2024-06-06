import { Request, Response, NextFunction } from "express";
import productService from "./product-service";
import BadRequestError from "../common/error-handlers/badrequest";

class ProductController {
  static async getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProduct();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductPaginated(
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

      const products = await productService.getProductByPagination(page, limit);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}
export default ProductController;
