import express from "express";
import { connectDB } from "./DB/connection.js";
import userRouter from "./src/modules/user/user.router.js";
import taskRouter from "./src/modules/task/task.router.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
await connectDB();

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use((error, req, res, next) => {
  const code = error.cause || 500;
  return res.status(code).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});
app.all("*", (req, res, next) => {
  return res.json({ success: false, message: "error not found" });
});

app.listen(port, () => {
  console.log("app is running on port", port);
});
