import express from "express";
import { syncTable } from "./DB/connection.js";
import userRouter from "./src/modules/user/user.router.js";
import noteRouter from "./src/modules/note/note.router.js";

const app = express();
const port = 4000;
await syncTable();

app.use(express.json());
app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.listen(port, () => {
  console.log("app is running on port", port);
});
