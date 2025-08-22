import mongoose, { Types } from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    userID: { type: Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("product", productSchema);
