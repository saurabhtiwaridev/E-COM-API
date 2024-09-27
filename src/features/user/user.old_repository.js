import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handling/applicationError.js";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }
  async createUser(newUser) {
    try {
      // 1. accessing the db

      const db = getDB();

      // 2. creating a  users collection

      const collection = db.collection(this.collection);
      

      // 3. add the document into collection

      await collection.insertOne(newUser);

      return newUser;
    } catch (error) {
      throw new ApplicationError(
        "error while operating with user collection",
        500
      );
    }
  }

  async findUserByEmail(email) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error while signing in with db operations",
        500
      );
    }
  }
}
