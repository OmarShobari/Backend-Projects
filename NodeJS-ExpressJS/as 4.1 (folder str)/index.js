import express from "express";

import userRouter from "./src/modules/user/user.router.js";
import productRouter from "./src/modules/product/product.router.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(port, () => {
  console.log("app is running on port", port);
});
