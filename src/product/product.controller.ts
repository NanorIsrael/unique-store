import { Request, Response, NextFunction } from "express";
import productService from "./product.service";
import BadRequestError from "../common/error-handlers/badrequest";
import ProductDto from "./product.dto";
import { validate } from "class-validator";
import RequestValidationError from "../common/error-handlers/validation";
import { Types } from "mongoose";

class ProductController {
  static async getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProduct();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"];
      if (!id) {
        throw new BadRequestError("product id required");
      }

      const objectId = new Types.ObjectId(id);
      const product = await productService.findProductById(objectId);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params["id"];
      const { name, stock, price } = req.body;

      if (!id) {
        throw new BadRequestError("product id required");
      }

      const productDto = new ProductDto(name, stock, price);
      const errors = await validate(productDto);
      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      }
      const product = await productService.updateProduct(id, productDto);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, stock, price } = req.body;

      const productDto = new ProductDto(name, stock, price);

      const errors = await validate(productDto);
      if (errors.length > 0) {
        throw new RequestValidationError(errors);
      }

      const product = await productService.createProduct(productDto);
      res.status(201).json(product);
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
