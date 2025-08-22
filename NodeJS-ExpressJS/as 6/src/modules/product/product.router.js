import { Router } from "express";
import * as controller from "./product.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();
//   1- add product (make sure that user already exist)
router.post("/", asyncHandler(controller.addProduct));
//   2- delete product (product creator only)
router.delete("/:id", asyncHandler(controller.deleteProduct));
//   3- update product (product owner only)
router.put("/:id", asyncHandler(controller.updateProduct));
//   4- get all products
router.get("/", asyncHandler(controller.getAll));
//   5- get all products with their owner’s information (using populate)
router.get("/join", asyncHandler(controller.getJoin));
//   6- sort products descending (By createdAt field)
router.get("/sort", asyncHandler(controller.sort));
export default router;

