import mongoose from "mongoose";

export default class ApplicationError extends Error {
  constructor(mesage, code) {
    super(mesage);
    this.code = code;
  }
}

export const appLevelErrorMiddleware = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  console.log(err)
  return res
    .status(500)
    .send("OOP's something went wrong with server .. will resoved it asap");
};
