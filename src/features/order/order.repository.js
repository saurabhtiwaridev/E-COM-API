import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import orderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async createOrder(userId) {
    try {
      const db = getDB();
      // 1. get the cart items, quantity and total price

      const orderCollection = db.collection(this.collection);

      const items = await this.calcTotalAmount(userId);

      const totalAmountOfCart = items.reduce((acc, item) => {
        return acc + item.totalAmount;
      }, 0);

      // 2. create the order out of that

      const newOrderModel = new orderModel(
        new ObjectId(userId),
        totalAmountOfCart,
        new Date()
      );

      await orderCollection.insertOne(newOrderModel);
      // 3. reduce the quanity of prodcut from the inventory

      for (let item of items) {
        await db.collection("products").updateOne(
          {
            _id: new ObjectId(item?.productId),
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      // 4. clear the cart item

      await db.collection("cartItems").deleteMany({
        userId: new ObjectId(userId),
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error while creating the order", 500);
    }
  }

  async calcTotalAmount(userId) {
    try {
      const db = getDB();

      const result = await db
        .collection("cartItems")
        .aggregate([
          // filte the document with the current userId
          {
            $match: { userId: new ObjectId(userId) },
          },

          // implement lookup on products collection based on productId attribute

          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },

          {
            $unwind: "$productInfo",
          },
          // based on the productInfo calculate totalPrice of the cartItems
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ])
        .toArray();
      return result;
    } catch (error) {}
  }
}
