import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const userRouters = express.Router();
const UsersController = new UserController();

userRouters.post("/signup", (req, res, next) => {
  UsersController.signUp(req, res, next);
});
userRouters.post("/signin", (req, res, next) => {
  UsersController.signIn(req, res, next);
});

userRouters.put("/resetPassword", jwtAuth, (req, res, next) => {
  UsersController.resetPassword(req, res, next);
});

export default userRouters;
