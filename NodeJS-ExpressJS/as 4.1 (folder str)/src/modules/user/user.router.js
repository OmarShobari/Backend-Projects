import { Router } from "express";
import * as controller from "./user.controller.js";

const router = Router();

// -user APIs-
// 1- add user (user must not found before)
router.post("/", controller.existUser, controller.addUser);
// 2- update user
router.put("/", controller.existUser, controller.updateUser);
// 3- delete user(user must be found)
router.delete("/", controller.existUser, controller.deleteUser);
// 4- search for user where his name start with "a" and age less than 30 => using like for characters
router.get("/like", controller.searchLike);
// 5- search for users by list of ids => using IN
router.get("/id", controller.searchIn);
// 6- get all user
router.get("/all", controller.getAll);
// 7- get all users with products (join)
router.get("/join", controller.getJoin);

export default router;
