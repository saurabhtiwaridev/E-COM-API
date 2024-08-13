import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // 1. check for tokens in Headers

  const token = req.headers["authorization"];

  // 2. return 401 if token is not present

  if (!token) {
    return res.status(401).send("Unautrized Request..!!");
  }

  // 3. verify the token using jsonwebtoken

  try {
    const payload = jwt.verify(token, "zT0vMz91bO");
  } catch (error) {
    //4. if error return 401
    return res.status(401).send("Unautrized Request..!!");
  }

  //5. call the next middleware in the pipeline

  next();
};

export default jwtAuth;
