import { Router } from "express";
import * as controller from "./task.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { authentication } from "../../middlewares/authentication.js";

const router = Router();
// 1-add task with status (toDo)(user must be logged in)
router.post("/", authentication, asyncHandler(controller.addTask));
// 2-update task (title , description , status)
// and assign task to other user(user must be logged in) (creator only can update task)
router.put("/:id", authentication, asyncHandler(controller.updateTask));
// 3-delete task(user must be logged in) (creator only can delete task)
router.delete("/:id", authentication, asyncHandler(controller.deleteTask));
// 4-get all tasks with user data
router.get("/getAll", asyncHandler(controller.getAll));
// 5-get tasks of oneUser with user data (user must be logged in)
router.get("/getOne", authentication, asyncHandler(controller.getOne));
// 6-get all tasks that not done after deadline
router.get("/getDeadline", asyncHandler(controller.getDeadline));
export default router;
