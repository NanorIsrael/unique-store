// models/User.js
import mongoose, { Types } from "mongoose";

export interface IProductLine {
  name: string;
  stock: number;
  price: number;
}

export interface ProductLineDoc extends IProductLine, Document {
  _id: Types.ObjectId;
}

const productLineSchema = new mongoose.Schema({
  quatity: Number,
  orderId: {
    ref: "Order",
    require: true,
  },
  productId: {
    ref: "Product",
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductLine = mongoose.model<ProductLineDoc>(
  "ProductLine",
  productLineSchema,
);

export default ProductLine;
