import express from "express";
import {
  signUp,
  signIn,
  updateUser,
  deleteUser,
  getUserData,
  getProfileData,
  updatePassword,
  forgetPassword,
  getAccountsByRecoveryEmail,
} from "./user.controller.js";
import { authentication } from "../../middlewares/authentication.js";

const router = express.Router();

// Public Routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forget-password", forgetPassword);

// Protected Routes
router.use(authentication);

router.put("/update", updateUser);
router.delete("/delete", deleteUser);
router.get("/profile", getUserData);
router.get("/profile/:userId", getProfileData);
router.put("/update-password", updatePassword);
router.get("/accounts/:recoveryEmail", getAccountsByRecoveryEmail);

export default router;
