// models/User.js
import mongoose, { Schema, Types } from "mongoose";

export interface IOrder {
  products: Types.ObjectId[];
  user_id: Types.ObjectId;
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
