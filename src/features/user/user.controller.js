import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";

export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const userCreated = UserModel.createUser(name, email, password, type);
    return res.status(201).send(userCreated);
  }

  signIn(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    const user = UserModel.authenticateUser(email, password);

    if (!user) {
      return res.status(404).send("Can not found this user in the db");
    } else {
      // create a jwt token for autentication
      const token = jwt.sign(
        {
          userId: user?.id,
          userType: user?.type,
          email: user?.email,
        },
        "zT0vMz91bO",
        {
          expiresIn: "1h",
        }
      );
      user.tokens = token;
      return res.status(200).send(user);
    }
  }
}
