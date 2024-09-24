import ApplicationError from "../error-handling/applicationError";

const erroHandler = (err, req, res, next) => {
  // User Defiend Error

  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }

  // System generated error

  res.status(500).send("something went wrong, please try later...!");

  next();
};

export default erroHandler;
