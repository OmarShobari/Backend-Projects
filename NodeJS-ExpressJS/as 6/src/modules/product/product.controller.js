import { Types } from "mongoose";
import { Product } from "../../../DB/models/product.model.js";
import { User } from "../../../DB/models/user.model.js";
Types;

//   1- add product (make sure that user already exist)
export const addProduct = async (req, res, next) => {
  const { name, description, price, userID } = req.body;
  console.log(name, description, price, userID);
  const user = await User.findById(userID);
  console.log(user);

  // Check if the user exists
  if (!user) {
    return next(new Error("User not found"));
    //return res.json({ success: false, message: "User not found" });
  }
  const product = await Product.create({ name, description, price, userID });
  return res.json({ success: true, results: product });
};
//   2- delete product (product creator only)
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const { Uid } = req.query;
  const product = await Product.findById(id);
  if (!product) {
    return next(new Error("product not found"));
    //return res.json({ success: false, message: "product not found" });
  }
  const owner = product.userID == Uid;
  if (!owner) {
    return next(new Error("Owner only can access"));
    //return res.json({ success: false, message: "Owner only can access" });
  }
  await product.deleteOne();
  return res.json({
    success: true,
    message: "product is deleted successfully",
  });
};
//   3- update product (product owner only)
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { Uid } = req.query;
  const { updatedData } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return next(new Error("product not found"));
    //return res.json({ success: false, message: "product not found" });
  }
  const owner = product.userID == Uid;
  if (!owner) {
    return next(new Error("Owner only can access"));
    //return res.json({ success: false, message: "Owner only can access" });
  }
  product.name = updatedData.name || product.name;
  product.description = updatedData.description || product.description;
  product.price = updatedData.price || product.price;
  const updatedProduct = await product.save();
  return res.json({
    success: true,
    results: updatedProduct,
  });
};
//   4- get all products
export const getAll = async (req, res, next) => {
  const products = await Product.find();
  return res.json({
    success: true,
    results: products,
  });
};
//   5- get all products with their owner’s information (using populate)
export const getJoin = async (req, res, next) => {
  const products = await Product.find().populate({
    path: "userID",
    select: "username email age gender -_id",
  });
  return res.json({
    success: true,
    results: products,
  });
};
//   6- sort products descending (By createdAt field)
export const sort = async (req, res, next) => {
  const sortedProducts = await Product.find().sort({ createdAt: -1 });
  //-1  descending order, 1  ascending order
  return res.json({ success: true, results: sortedProducts });
};
