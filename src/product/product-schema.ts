// models/User.js
import mongoose, { Types } from "mongoose";

export interface ProductDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  stock: number;
  price: number;
  createdAt: Date;
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

const Product = mongoose.model("Product", productSchema);

export default Product;
