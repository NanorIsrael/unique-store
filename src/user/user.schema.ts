// models/User.js
import mongoose, { Types } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface UserDoc extends IUser, Document {
  _id: Types.ObjectId;
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
  },
  {
    timestamps: true,
  },
);
// Pre middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  // Check if the password is modified or it's a new user
  if (!this.isModified("password")) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(
    this.get("password") as string,
    Number(process.env.BCRYPT_ITERATIONS_COST),
  );

  this.set("password", hashedPassword);
  next();
});

const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
