import { Router } from "express";
import * as controller from "./user.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";

const router = Router();

// 1-sign up (email must be unique)
router.post("/signUp", asyncHandler(controller.signUp));
// 2-sign in
router.post("/signIn", asyncHandler(controller.signIn));
// 3-update user
router.put("/:id", asyncHandler(controller.updateUser));
// 4-delete user
router.delete("/:id", asyncHandler(controller.deleteUser));
// 5-search for user where his name contains with "X" and age less than Y, please note that X, Y are variables
router.get("/search", asyncHandler(controller.searchCondition));
// 6-search for users where their ages are between X and Y
router.get("/between", asyncHandler(controller.searchAgesBetween));
// 7-get all users
router.get("/", asyncHandler(controller.getAll));
// 8- get all user product
router.get("/prod/:userID", asyncHandler(controller.getProd));
export default router;
