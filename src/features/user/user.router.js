import express from "express";
import UserController from "./user.controller.js";

const userRouters = express.Router();
const UsersController = new UserController();

userRouters.post("/signup", UsersController.signUp);
userRouters.post("/signin", UsersController.signIn);

export default userRouters;
