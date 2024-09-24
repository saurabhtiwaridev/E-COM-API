import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

const productRouters = express.Router();

const productController = new ProductController();

// for any routes coming in with localhost/api/products
productRouters.get("/filter", (req, res) => {
  productController.filterProduct(req, res);
});
productRouters.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouters.post("/", upload.single("imageUrl"), (req, res) => {
  productController.createNewProduct(req, res);
});
productRouters.get("/averagePrice", (req, res) => {
  productController.averagePrice(req, res);
});

productRouters.get("/averageRatings", (req, res) => {
  productController.averageRatings(req, res);
});

productRouters.get("/countRatings", (req, res) => {
  productController.countRatings(req, res);
});
productRouters.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});
productRouters.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});

export default productRouters;
