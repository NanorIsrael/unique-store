// models/User.js
import mongoose, { Types } from "mongoose";

export interface IProductLine {
  quantity: number;
  productId: Types.ObjectId;
}

export interface ProductLineDoc extends IProductLine, Document {
  _id: Types.ObjectId;
  order_id: Types.ObjectId;
}

const productLineSchema = new mongoose.Schema({
  quatity: Number,
  order_id: {
    ref: "Order",
    type: Types.ObjectId,
  },
  product_id: {
    ref: "Product",
    type: Types.ObjectId,
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
