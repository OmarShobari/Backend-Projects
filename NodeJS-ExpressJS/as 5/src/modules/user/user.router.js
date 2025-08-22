import { Router } from "express";
import * as controller from "./user.controller.js";
const router = Router();

// 1- sign up
router.post("/", controller.signUp);
// 2- sign in
router.post("/signIn", controller.signIn);
// 3- update user
router.put("/", controller.updateUser);
// 4- delete user
router.delete("/", controller.deleteUser);
// 5- search for user where his name start with "char"
// and age less than (n) => using like for characters
router.get("/like", controller.like);
// 6- search for user where his age is between (n1) and (n2)
router.get("/between", controller.between);
// 7- get the (n) oldest users
router.get("/oldest", controller.oldest);
// 8- search for users by list of ids => using IN
router.get("/in", controller.idsIN);
// 9- get all user
router.get("/", controller.all);
export default router;
