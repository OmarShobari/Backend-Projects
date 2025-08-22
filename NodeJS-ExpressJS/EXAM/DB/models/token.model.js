import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const Token = model("Token", tokenSchema);

export default Token;
