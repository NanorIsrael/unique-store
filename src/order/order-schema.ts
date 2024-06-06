// models/User.js
import mongoose, { Types } from "mongoose";
import ProductLine, { IProductLine } from "../product-line/product-line.schema";

export interface IOrder {
  products: IProductLine[];
  user_id: Types.ObjectId;
}

export interface OrderDoc extends IOrder, Document {
  _id: Types.ObjectId;
}

const orderSchema = new mongoose.Schema({
  products: [ProductLine],
  user_id: {
    ref: "User",
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<OrderDoc>("Order", orderSchema);

export default Order;
