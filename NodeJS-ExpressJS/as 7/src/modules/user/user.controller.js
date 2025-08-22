import User from "../../../DB/models/user.model.js";
import Token from "../../../DB/models/token.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";

// update the isValid property for expired tokens
const updateExpiredTokens = asyncHandler(async () => {
  const currentDate = new Date();
  await Token.updateMany(
    { expiredAt: { $lt: currentDate }, isValid: true },
    { isValid: false }
  );
  console.log("Expired tokens updated successfully");
});

// Set a timer to check expired tokens every hour
const tokenExpirationCheckInterval = 1 * 60 * 60 * 1000; // 1 hour
setInterval(updateExpiredTokens, tokenExpirationCheckInterval);

// 1-signUp
export const signUp = async (req, res, next) => {
  const { username, email, confirmPassword, age, gender, phone } = req.body;

  let { password } = req.body;
  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match", { cause: 400 }));
  }

  // Check if the user already exists
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(new Error("User already exists", { cause: 400 }));
  }

  // hashing pass

  password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
  //console.log({ password });

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

  return res.status(201).json({ success: true, results: user });
};
// 2-login-->with create token
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Find user email
  const user = await User.findOne({ email });
  // Check if the user exists
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return next(new Error("Incorrect password", { cause: 400 }));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    { expiresIn: "1d" }
  );

  let currentDate = new Date();
  let expirationTime = currentDate.getTime() + 1 * 60 * 60 * 24 * 1000; // 1 day
  await Token.create({
    token,
    userID: user._id,
    agent: req.headers["user-agent"],
    expiredAt: new Date(expirationTime),
  });

  return res.json({
    success: true,
    message: "user sign in successfully",
    token,
  });
};
// 3-change password (user must be logged in)
export const changePassword = async (req, res, next) => {
  let { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return next(new Error("Passwords do not match", { cause: 400 }));
  }

  const user = req.user;

  user.password = bcrypt.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  await user.save();
  return res.json({
    success: true,
    message: "password has been changed successfully",
  });
};
// 4-update user (age , firstName , lastName)(user must be logged in)
export const updateUser = async (req, res, next) => {
  const { updatedData } = req.body;

  const user = req.user;

  user.username = updatedData.username || user.username;
  user.email = updatedData.email || user.email;
  user.age = updatedData.age || user.age;
  user.gender = updatedData.gender || user.gender;
  user.phone = updatedData.phone || user.phone;

  // Save the updated user to the database
  const updatedUser = await user.save();

  return res.json({ success: true, user: updatedUser });
};
// 5-delete user(user must be logged in)
export const deleteUser = async (req, res, next) => {
  await User.deleteOne({ _id: req.payload.id });
  await Token.updateMany({ userID: req.payload.id }, { isValid: false });
  return res.json({ success: true, message: "User is deleted successfully" });
};
// 6-soft delete(user must be logged in)
export const softDelete = async (req, res, next) => {
  const userId = req.user._id;
  const result = await User.updateOne({ _id: userId }, { isDeleted: true });
  await Token.updateMany({ userID: req.payload.id }, { isValid: false });
  return res.json({
    success: true,
    message: "User soft deleted successfully",
  });
};
// 7-logout
export const logout = async (req, res, next) => {
  const { token } = req.headers;
  await Token.findOneAndUpdate({ token }, { isValid: false });

  return res.json({ success: true, message: "user logged out!" });
};
