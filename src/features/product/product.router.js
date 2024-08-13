import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

const productRouters = express.Router();

const productController = new ProductController();

// for any routes coming in with localhost/api/products
productRouters.get("/filters", productController.filterProduct);
productRouters.get("/", productController.getAllProducts);
productRouters.post(
  "/",
  upload.single("imageUrl"),
  productController.createNewProduct
);
productRouters.get("/:id", productController.getOneProduct);

export default productRouters;
