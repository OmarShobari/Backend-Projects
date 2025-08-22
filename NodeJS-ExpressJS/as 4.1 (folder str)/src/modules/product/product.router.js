import * as controller from "./product.controller.js";
import { Router } from "express";

const router = Router();

// -product APIs-
// 1- add product(product must not found before)
router.post("/", controller.existProduct, controller.addProduct);
// 2- delete product (product owner only can do this and product must be found )
router.delete(
  "/",
  controller.existProduct,
  controller.owner,
  controller.deleteProduct
);
// 3- update product (product owner only) and product must be found
router.put(
  "/",
  controller.existProduct,
  controller.owner,
  controller.updateProduct
);
// 4- get all products
router.get("/all", controller.getAll);
// 5- search for products where price greater than 3000
router.get("/", controller.search);

export default router;
