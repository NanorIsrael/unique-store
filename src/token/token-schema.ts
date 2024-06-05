// models/User.js
import mongoose, { Schema } from "mongoose";

export interface TokenDoc extends Document {
  reset_token: string;
  user_id: string;
}

const tokenSchema = new mongoose.Schema({
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

const Token = mongoose.model<TokenDoc>("Token", tokenSchema);

export default Token;
