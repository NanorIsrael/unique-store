// models/adminUser.js
import mongoose, { Schema, Types } from "mongoose";

export interface AdminDoc extends Document {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  user_id: Types.ObjectId;
}
const adminUserSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model<AdminDoc>("Admin", adminUserSchema);

export default Admin;
