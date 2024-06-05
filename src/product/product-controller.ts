import { Request, Response, NextFunction } from "express";
import productService from "./product-service";

class ProductController {
  static async getAllProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProduct();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}
export default ProductController;
