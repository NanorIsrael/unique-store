// models/User.js
import mongoose, { Schema, Types } from "mongoose";

export interface IProductLine {
  quantity: number;
  product_id: Types.ObjectId;
  order_id: Types.ObjectId;
}

export interface ProductLineDoc extends IProductLine, Document {
  _id: Types.ObjectId;
}

const productLineSchema = new mongoose.Schema({
  quatity: Number,
  order_id: {
    ref: "Order",
    type: Schema.Types.ObjectId,
  },
  product_id: {
    ref: "Product",
    type: Schema.Types.ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const ProductLine = mongoose.model<ProductLineDoc>(
  "ProductLine",
  productLineSchema,
);

export default ProductLine;
