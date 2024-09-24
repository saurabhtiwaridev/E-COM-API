import { MongoClient } from "mongodb";

let client;

export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("mongodb is connected");
      createCounter(clientInstance.db());
      createIndexes(clientInstance.db());
    })
    .catch((err) => {
      console.log("error while  connecting to database");
    });
};

export const getDB = () => {
  return client.db();
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });

  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

const createIndexes = async (db) => {
  try {
    // single field index

    await db.collection("products").createIndex({ price: 1 });

    // compound index

    await db.collection("products").createIndex({ name: 1, category: -1 });

    // text search indexes

    await db.collection("products").createIndex({ desc: "text" });
  } catch (error) {
    throw new Error("error while creating indexes");
  }
};
