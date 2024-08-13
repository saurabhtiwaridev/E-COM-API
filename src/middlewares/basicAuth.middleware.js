import UserModel from "../features/user/user.model.js";

const basicAuthroizer = (req, res, next) => {
  // 1. Acces the Header fromt the request object

  const authHeader = req.headers["authorization"]; // because header is an array

  console.log("authHeader from basicAuth", authHeader);

  if (!authHeader) {
    return res.status(401).send("You'r not authrized to make the call");
  }

  //2. decode the authHeader "Basic nfqjwen3423452njfnej"

  const decodeAuth = authHeader.replace("Basic", "");

  const creds = Buffer.from(decodeAuth, "base64").toString("utf8"); // [email : password];
  console.log("creds from basicAuth", creds);

  const actualCreds = creds.split(":");

  const isUserFound = checkCredsMathWithUserCollection(actualCreds);

  if (!isUserFound) {
    return res.status(401).send("Incorrect Credentials");
  } else {
    next();
  }
};

const checkCredsMathWithUserCollection = (actualCreds) => {
  const users = UserModel.getAllUser();

  const userFound = users?.find(
    (u) => u.email == actualCreds[0] && u.password == actualCreds[1]
  );

  return userFound;
};

export default basicAuthroizer;
