// models/User.js
import mongoose, { Schema } from "mongoose";

export interface authTokenDoc extends Document {
  reset_token: string;
  user_id: string;
}

const authTokenSchema = new mongoose.Schema({
  reset_token: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Token = mongoose.model<authTokenDoc>("Token", authTokenSchema);

export default Token;
