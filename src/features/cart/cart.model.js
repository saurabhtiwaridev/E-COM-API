import productModel from "../product/product.model.js";

export default class CartModel {
  constructor(userId, productId, quantity) {
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
  }

  static updateCartItem(productId, quantity) {
    const checkProductExistInCartIndex = carts.findIndex(
      (p) => p.productId == productId
    );

    if (checkProductExistInCartIndex == -1) {
      return "there is no product with given id in the cart";
    } else {
      carts[checkProductExistInCartIndex].quantity = quantity;
    }
  }
}

const carts = [];
