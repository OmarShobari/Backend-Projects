import { Router } from "express";
import * as controller from "./note.controller.js";
const router = Router();

// 1- add note
router.post("/", controller.addNote);
// 2- delete note (note owner only )
router.delete("/", controller.deleteNote);
// 3- update note (note owner only)
router.put("/", controller.updateNote);
// 4- get all notes
router.get("/", controller.getAll);
// 5- get all notes with their owners informaion
// (using include)
router.get("/join", controller.getJoin);

export default router;
