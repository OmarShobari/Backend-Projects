import { Product } from "../../../DB/models/product.model.js";
import { User } from "../../../DB/models/user.model.js";
// 1-sign up (email must be unique)
export const signUp = async (req, res, next) => {
  const { username, email, password, confirmPassword, age, gender, phone } =
    req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match"));
    //return res.json({ success: false, message: "Passwords do not match" });
  }

  // Check if the user already exists
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(new Error("User already exists"));
    //return res.json({ success: false, message: "User already exists" });
  }

  // Create a new user
  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
    age,
    gender,
    phone,
  });

  return res.json({ success: true, results: user });
};
// 2-sign in
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Find user email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    return next(new Error("User not found"));
    //return res.json({ success: false, message: "User not found" });
  }

  const isPasswordValid = user.password == password;

  if (!isPasswordValid) {
    return next(new Error("Incorrect password"));
    //return res.json({ success: false, message: "Incorrect password" });
  }

  return res.json({ success: true, message: "user sign in successfully" });
};
// 3-update user
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { updatedData } = req.body;

  // Find the user by ID
  const user = await User.findById(id);

  // Check if the user exists
  if (!user) {
    return next(new Error("User not found"));
    //return res.json({ success: false, message: "User not found" });
  }

  // Update user properties with the provided data
  // افرض هو مبعتليش حاجة منهم ؟
  // يبقى نستعمل or
  user.username = updatedData.username || user.username;
  user.email = updatedData.email || user.email;
  user.password = updatedData.password || user.password;
  user.age = updatedData.age || user.age;
  user.gender = updatedData.gender || user.gender;
  user.phone = updatedData.phone || user.phone;

  // Save the updated user to the database
  const updatedUser = await user.save();

  return res.json({ success: true, user: updatedUser });
};
// 4-delete user
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new Error("User not found"));
    //return res.json({ success: false, message: "User not found" });
  }
  return res.json({ success: true, message: "User is deleted successfully" });
};
// 5-search for user where his name contains with "X" and age less than Y please note that X, Y are variables
export const searchCondition = async (req, res, next) => {
  const { nameSubstring, maxAge } = req.body;

  // regex for case-insensitive name search
  // بنستعمل "i"
  const nameRegex = new RegExp(nameSubstring, "i");

  // Perform the search using Mongoose
  const users = await User.find({
    username: { $regex: nameRegex },
    age: { $lt: maxAge },
  });
  if (users.length < 1) {
    return next(new Error("no users found"));
    //return res.json({ success: false, message: "no users found" });
  }
  return res.json({ success: true, results: users });
};
// 6-search for users where their ages are between X and Y
export const searchAgesBetween = async (req, res, next) => {
  const { minAge, maxAge } = req.body;
  const users = await User.find({
    age: { $gte: minAge, $lte: maxAge },
  });
  if (users.length < 1) {
    return next(new Error("no users found"));
    //return res.json({ success: false, message: "no users found" });
  }
  return res.json({ success: true, results: users });
};
// 7-get all users
export const getAll = async (req, res, next) => {
  const users = await User.find();
  return res.json({
    success: true,
    results: users,
  });
};
// 8- get all user products
export const getProd = async (req, res, next) => {
  const { userID } = req.params;
  const user = await User.findById(userID);
  // Check if the user exists
  if (!user) {
    return next(new Error("User not found"));
    //return res.json({ success: false, message: "User not found" });
  }
  const products = await Product.find({ userID });
  if (products.length < 1) {
    return next(new Error("no products found"));
    //return res.json({ success: false, message: "no products found" });
  }
  return res.json({
    success: true,
    results: products,
  });
};
