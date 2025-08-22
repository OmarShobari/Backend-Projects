import express from "express";
import { connectDB } from "./DB/connection.js";
import userRouter from "./src/modules/user/user.router.js";
import productRouter from "./src/modules/product/product.router.js";

const app = express();
const port = 4000;
await connectDB();

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use((error, req, res, next) => {
  return res.json({
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
