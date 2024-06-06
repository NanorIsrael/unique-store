// models/User.js
import mongoose, { Types } from "mongoose";

export interface IProduct {
  name: string;
  stock: number;
  price: number;
}

export interface ProductDoc extends IProduct, Document {
  _id: Types.ObjectId;
}

const productSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model<ProductDoc>("Product", productSchema);

export default Product;
