import CartModel from "./cart.model.js";
import CartRepositry from "./cart.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepositry();
  }
  async add(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;

      const newCartItem = new CartModel(userId, productId, quantity);
      await this.cartRepository.addToCart(newCartItem);
      return res.status(201).send("item successfully added to the cart...!");
    } catch (error) {
      throw new Error("eror while adding the item to cart", 500);
    }
  }

  async getCartItems(req, res) {
    try {
      const userId = req.userId;
      const cartItems = await this.cartRepository.getCartItem(userId);
      return res.status(200).send(cartItems);
    } catch (error) {
      throw new Error("eror while filtering  the item to cart", 500);
    }
  }

  updateCartItem(req, res) {
    const { productId, quantity } = req.body;

    const error = CartModel.updateCartItem(productId, quantity);

    if (error) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Cart item updated successfully...!");
    }
  }

  async deleteCartItem(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const isDeleted = await this.cartRepository.deleteCartItem(id, userId);

      if (isDeleted) {
        return res.status(200).send("Cart item are successfully deleted ...!");
      } else {
        return res.status(403).send("item not found");
      }
    } catch (error) {
      throw new Error("eror while deleting  the item to cart", 500);
    }
  }
}
