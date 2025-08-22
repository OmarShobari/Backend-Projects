import mongoose, { Types } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: Number,
    gender: String,
    phone: String,
    // products: [{ type: Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("user", userSchema);
