import ApplicationError from "../../error-handling/applicationError.js";
import OrderRepository from "./order.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async generateOrder(req, res) {
    try {
      const userId = req.userId;
      console.log(userId)
      const result = await this.orderRepository.createOrder(userId);

      return res.status(201).send("order created successfully");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error while creating the order", 500);
    }
  }
}
