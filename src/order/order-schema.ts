// models/User.js
import mongoose, { Types } from "mongoose";
import { IProductLine } from "../product-line/product.line.schema";

export interface IOrder {
  products: IProductLine[];
  user_id: Types.ObjectId;
}

export interface OrderDoc extends IOrder, Document {
  _id: Types.ObjectId;
}

const orderSchema = new mongoose.Schema({
  products: [
    {
      ref: "ProductLine",
      type: Types.ObjectId,
    },
  ],
  user_id: {
    ref: "User",
    type: Types.ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<OrderDoc>("Order", orderSchema);

export default Order;
