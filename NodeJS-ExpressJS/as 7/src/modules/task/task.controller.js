import Task from "../../../DB/models/task.model.js";
import User from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";

// 1-add task with status (toDo)(user must be logged in)
export const addTask = async (req, res, next) => {
  const { title, description, assignTo, deadline } = req.body;
  const userID = req.payload.id;
  const task = await Task.create({
    title,
    description,
    status: "toDo",
    assignTo,
    deadline,
    userID,
  });
  return res.status(201).json({ success: true, results: task });
};
// 2-update task (title , description , status)
// and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  //const { Uid } = req.query;
  const Uid = req.payload.id;
  const { updatedData } = req.body;
  const task = await Task.findById(id);
  if (!task) {
    return next(new Error("task not found", { cause: 404 }));
  }
  const owner = task.userID == Uid;
  if (!owner) {
    return next(new Error("Owner only can access", { cause: 401 }));
  }
  task.title = updatedData.title || task.title;
  task.description = updatedData.description || task.description;
  task.status = updatedData.status || task.status;
  task.assignTo = updatedData.assignTo || task.assignTo;
  const updatedTask = await task.save();
  return res.json({
    success: true,
    results: updatedTask,
  });
};
// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  //const { Uid } = req.query;
  const Uid = req.payload.id;
  const task = await Task.findById(id);
  if (!task) {
    return next(new Error("task not found", { cause: 404 }));
  }
  const owner = task.userID == Uid;
  if (!owner) {
    return next(new Error("Owner only can access", { cause: 401 }));
  }
  await task.deleteOne();
  return res.json({
    success: true,
    message: "task is deleted successfully",
  });
};
// 4-get all tasks with user data
export const getAll = async (req, res, next) => {
  const tasks = await Task.find().populate({
    path: "userID",
    select: "username email age gender -_id",
  });
  return res.json({
    success: true,
    results: tasks,
  });
};
// 5-get tasks of oneUser with user data (user must be logged in)
export const getOne = async (req, res, next) => {
  const assignToID = req.payload.id;
  const tasks = await Task.find({ assignTo: assignToID })
    .populate({ path: "userID", select: "username gender email phone -_id" })
    .populate({ path: "assignTo", select: "username gender email phone -_id" });

  return res.json({ success: true, tasks });
};
// 6-get all tasks that not done after deadline
export const getDeadline = async (req, res, next) => {
  const currentDateTime = new Date();
  const tasks = await Task.find({
    status: { $ne: "done" },
    deadline: { $lt: currentDateTime },
  });

  return res.json({ success: true, tasks });
};
