import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handling/applicationError.js";

export default class PorductRepository {
  constructor() {
    this.collection = "products";
  }
  async addProduct(newProdut) {
    try {
      const db = getDB();

      const productsCollection = db.collection(this.collection);

      await productsCollection.insertOne(newProdut);

      return newProdut;
    } catch (error) {
      throw new ApplicationError("error while creating product in the db", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.find().toArray();
    } catch (error) {
      throw new ApplicationError("error while creating product in the db", 500);
    }
  }

  async getProductById(id) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const newId = new ObjectId(id);

      return await collection.findOne({ _id: newId });
    } catch (error) {
      throw new ApplicationError("error while finding the product by id", 500);
    }
  }

  async filter(minPrice, category) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      let filterExpression = {};

      if (minPrice) {
        filterExpression.price = {
          $gte: parseFloat(minPrice),
        };
      }
      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }

      if (category) {
        filterExpression = {
          $and: [{ category: category }, filterExpression],
        };
      }

      const product = await collection
        .find(filterExpression)
        .project({ name: 1, desc: 1, category: 1 })
        .toArray();
      return product;
    } catch (error) {
      throw new ApplicationError(
        "error while filtering the product in the db",
        500
      );
    }
  }

  // this rateProduct method is not that much good due to race condition

  // async rateProduct(userId, productId, rate) {
  //   try {
  //     const db = getDB();

  //     const collection = db.collection(this.collection);

  //     const product = await collection.findOne({
  //       _id: new ObjectId(productId),
  //     });

  //     const findRating = product?.ratings?.find((p) => p.userId == userId);

  //     if (findRating) {
  //       // update the rating for the same userId;

  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rate": rate,
  //           },
  //         }
  //       );
  //     } else {
  //       // create a new rating array into the product document

  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //         },
  //         {
  //           $push: {
  //             ratings: {
  //               userId: new ObjectId(userId),
  //               rate,
  //             },
  //           },
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApplicationError("error while rating the product", 500);
  //   }
  // }

  async rateProduct(userId, productId, rate) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      // first remove the rating if it's exist with pull operator

      await collection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $pull: {
            ratings: {
              userId: new ObjectId(userId),
            },
          },
        }
      );

      // then after create a new entry

      await collection.updateOne(
        {
          _id: new ObjectId(productId),
        },
        {
          $push: {
            ratings: {
              userId: new ObjectId(userId),
              rate,
            },
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error while rating the product", 500);
    }
  }

  async avergaePriceCategoryWise() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: {
                $avg: "$price",
              },
            },
          },
        ])
        ?.toArray();
    } catch (error) {
      throw new ApplicationError(
        "error while calculating average price of product , category wise",
        500
      );
    }
  }

  async averageRatingsOfProducts() {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      // destructure the ratings array which will create document with help of $unwind operator
      const pipeline1 = {
        $unwind: "$ratings",
      };

      // group the document on the basis of product Name and then calcualte the avergae ratings

      const pipeline2 = {
        $group: {
          _id: "$name",
          averageRating: {
            $avg: "$ratings.rate",
          },
        },
      };

      return await collection.aggregate([pipeline1, pipeline2]).toArray();
    } catch (error) {
      throw new ApplicationError(
        "error while calculating average ratings of product , category wise",
        500
      );
    }
  }

  async countOfRatingsProductWise() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const pipeline1 = {
        $project: {
          name: 1,
          countOfRating: {
            $cond: {
              if: {
                $isArray: "$ratings",
              },
              then: {
                $size: "$ratings",
              },
              else: 0,
            },
          },
        },
      };

      return await collection.aggregate([pipeline1]).toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error while calculation the cout of ratings",
        500
      );
    }
  }
}
