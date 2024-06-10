import { Types } from "mongoose";
import dataSource from "../utils";
import ProductDto from "./product.dto";
import Product from "./product.schema";

export class ProductService {
  constructor() {
    dataSource.getDBConection();
  }

  async createProduct(product: ProductDto) {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async findProductById(id: Types.ObjectId) {
    const product = await Product.findById({ _id: id });

    return product;
  }

  async getAllProduct() {
    const product = await Product.find({});
    return product;
  }

  async updateProduct(productId: string, product: Partial<ProductDto>) {
    const updatedProduct = await Product.findByIdAndUpdate(productId, product, {
      new: true,
    });
    return updatedProduct;
  }

  async deleteProduct(productId: string) {
    return await Product.findByIdAndDelete(productId);
  }

  async getProductByPagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await Product.find().skip(skip).limit(limit);
    return { page, limit, total, pages, data };
  }

  async getLowStockProducts({
    threshHold,
    page,
    limit,
  }: {
    page: number;
    limit: number;
    threshHold: number;
  }) {
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / limit);
    const data = await Product.find({ stock: { $lt: threshHold } })
      .skip(skip)
      .limit(limit);
    return { page, limit, total, pages, data };
  }
}

export default new ProductService();
