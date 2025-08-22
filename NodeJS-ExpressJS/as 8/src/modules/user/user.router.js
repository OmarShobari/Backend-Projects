import { Router } from "express";
import * as controller from "./user.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { authentication } from "./../../middlewares/authentication.js";
const router = Router();
// 1-signUp
router.post("/signUp", asyncHandler(controller.signUp));
// 2-login-->with create token
router.post("/login", asyncHandler(controller.login));
// 3-change password (user must be logged in)
router.patch("/", authentication, asyncHandler(controller.changePassword));
// 4-update user (age , firstName , lastName)(user must be logged in)
router.put("/", authentication, asyncHandler(controller.updateUser));
// 5-delete user(user must be logged in)
router.delete("/", authentication, asyncHandler(controller.deleteUser));
// 6-soft delete(user must be logged in)
router.delete("/soft", authentication, asyncHandler(controller.softDelete));
// 7-logout
router.post("/logout", authentication, asyncHandler(controller.logout));
export default router;
