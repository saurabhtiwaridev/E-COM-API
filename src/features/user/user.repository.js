import mongoose from "mongoose";
import { UserSchema } from "./user.schema.js";
import ApplicationError from "../../error-handling/applicationError.js";

const UserModel = mongoose.model("User", UserSchema);

export default class UserRepository {
  async createUser(user) {
    try {
      // create the instance of UserModel which will link to document

      const newUser = new UserModel(user);

      await newUser.save();

      return newUser;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw error;
      } else {
        throw new ApplicationError(
          "error while operating with user collection",
          500
        );
      }
    }
  }

  async findUserByEmail(email) {
    try {
      const result = await UserModel.findOne({
        email: email,
      });

      console.log(result);

      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error while signing in with db operations",
        500
      );
    }
  }

  async resetUserPassword(newPassword, userId) {
    try {
      const result = await UserModel.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            password: newPassword,
          },
        }
      );

      return result;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error while resetting the password", 500);
    }
  }
}
