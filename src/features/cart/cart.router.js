import express from "express";
import CartController from "./cart.controller.js";

const cartRouter = express.Router();
const cartCotroller = new CartController();

cartRouter.post("/", (req, res) => {
  cartCotroller.add(req, res);
});
cartRouter.get("/", (req, res) => {
  cartCotroller.getCartItems(req, res);
});
cartRouter.post("/update", cartCotroller.updateCartItem);
cartRouter.delete("/:id", (req, res) => {
  cartCotroller.deleteCartItem(req, res);
});

export default cartRouter;
