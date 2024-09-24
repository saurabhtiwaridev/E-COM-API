import ApplicationError from "../../error-handling/applicationError.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.usersRepository = new UserRepository();
  }

  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword, type);

      const userCreated = await this.usersRepository.createUser(user);

      console.log(userCreated);
      return res.status(201).send(userCreated);
    } catch (error) {
      throw new ApplicationError("error whle creating the user", 500);
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.usersRepository.findUserByEmail(email, password);

      if (!user) {
        return res.status(404).send("Can not found this user in the db");
      } else {
        // check for user password  with hased password

        const result = await bcrypt.compare(password, user.password);

        if (result) {
          // create a jwt token for autentication
          const token = jwt.sign(
            {
              userId: user?._id,
              userType: user?.type,
              email: user?.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          user.tokens = token;
          return res.status(200).send(user);
        } else {
          return res
            .status(400)
            .send("credential not matched please try again");
        }
      }
    } catch (error) {
      throw new ApplicationError(
        "error in controller of siging in method",
        500
      );
    }
  }
}
