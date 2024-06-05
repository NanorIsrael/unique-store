import { Types } from "mongoose";
import dataSource from "../utils";
import ProductDto from "./product-dto";
import Product from "./product-schema";
import BadRequestError from "../common/error-handlers/badrequest";

class ProductService {
  constructor() {
    dataSource.getDBConection();
  }

  async createProduct(product: ProductDto) {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async findProductById(id: Types.ObjectId) {
    const product = await Product.findById({ _id: id });
    if (!product) {
      throw new BadRequestError(`product with id: ${id} not found`);
    }
    return product;
  }

  async getAllProduct() {
    const product = await Product.find({});
    return product;
  }
}
export default new ProductService();
