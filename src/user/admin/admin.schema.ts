// models/User.js
import mongoose, { Types } from "mongoose";

export interface AdminDoc extends Document {
  createdAt: NativeDate;
  updatedAt: NativeDate;
  user_id: Types.ObjectId;
}
const adminUserSchema = new mongoose.Schema(
  {
    user_id: {
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
