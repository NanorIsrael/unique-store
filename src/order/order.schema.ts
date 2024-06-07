// models/User.js
import mongoose, { Schema } from "mongoose";
import { IProductLine } from "../product-line/product.line.schema";

export interface IOrder {
  products: IProductLine[];
  user_id: Schema.Types.ObjectId;
}

export interface OrderDoc extends IOrder, Document {
  _id: Schema.Types.ObjectId;
}

const orderSchema = new mongoose.Schema({
  products: [
    {
      ref: "ProductLine",
      type: Schema.Types.ObjectId,
    },
  ],
  user_id: {
    ref: "User",
    type: Schema.Types.ObjectId,
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
