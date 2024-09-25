import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import orderModel from "./order.model.js";
import ApplicationError from "../../error-handling/applicationError.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async createOrder(userId) {
    const client = getClient();

    const session = client.startSession();
    try {
      session.startTransaction();
      const db = getDB();
      // 1. get the cart items, quantity and total price

      const orderCollection = db.collection(this.collection);

      const items = await this.calcTotalAmount(userId, session);

      const totalAmountOfCart = items.reduce((acc, item) => {
        return acc + item.totalAmount;
      }, 0);

      // 2. create the order out of that

      const newOrderModel = new orderModel(
        new ObjectId(userId),
        totalAmountOfCart,
        new Date()
      );

      await orderCollection.insertOne(newOrderModel, { session });
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
          },
          {
            session,
          }
        );
      }

      // 4. clear the cart item

      await db.collection("cartItems").deleteMany(
        {
          userId: new ObjectId(userId),
        },
        { session }
      );

      // after returning from there commit the transcation and close the session
      session.commitTransaction();
      session.endSession();
      return;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      throw new ApplicationError("error while creating the order", 500);
    }
  }

  async calcTotalAmount(userId, session) {
    try {
      const db = getDB();

      const result = await db
        .collection("cartItems")
        .aggregate(
          [
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
          ],
          { session }
        )
        .toArray();
      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error while calculating total count", 500);
    }
  }
}
