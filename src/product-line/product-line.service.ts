import { Types } from "mongoose";
import dataSource from "../utils";
import ProductLine from "./product.line.schema";

export class ProductLineService {
  constructor() {
    dataSource.getDBConection();
  }
  async getAllProductLines() {
    return await ProductLine.find({});
  }
  async getProductLineById(id: string | Types.ObjectId) {
    return await ProductLine.findById(id);
  }
}
