import express from "express";
import UserController from "./user.controller.js";

const userRouters = express.Router();
const UsersController = new UserController();

userRouters.post("/signup", (req, res) => {
  UsersController.signUp(req, res);
});
userRouters.post("/signin", (req, res) => {
  UsersController.signIn(req, res);
});

export default userRouters;
