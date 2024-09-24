import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
export default class CartRepositry {
  constructor() {
    this.collection = "cartItems";
  }

  async addToCart(cartItem) {
    try {
      const { userId, productId, quantity } = cartItem;
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);

      await collection.updateOne(
        {
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
        },
        {
          $setOnInsert: {
            _id: id,
          },
          $inc: {
            quantity: quantity,
          },
        },
        {
          upsert: true,
        }
      );
    } catch (error) {
      console.log("error occured while adding cart item to db", 500);
    }
  }

  async getCartItem(userId) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection
        .find({
          userId: new ObjectId(userId),
        })
        .toArray();
    } catch (error) {
      console.log("error occured while filtering the  cart item from db", 500);
    }
  }

  async deleteCartItem(cartItemId, userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userId: new ObjectId(userId),
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.log("error occured while delting the  cart item from db", 500);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db.collection("counters").findOneAndUpdate(
      {
        _id: "cartItemId",
      },
      {
        $inc: {
          value: 1,
        },
      },
      {
        returnDocument: "after",
      }
    );

    return resultDocument.value;
  }
}
