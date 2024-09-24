import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import productRouters from "./src/features/product/product.router.js";
import bodyParser from "body-parser";
import userRouters from "./src/features/user/user.router.js";
import cartRouters from "./src/features/cart/cart.router.js";
import basicAuthroizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
// import apiDocs from "./Swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import { appLevelErrorMiddleware } from "./src/error-handling/applicationError.js";
import orderRouter from "./src/features/order/order.router.js";

const port = process.env.PORT || 4200;

const server = express();

// Configuration for CORS (Cross Origin Resource Sharing) Error

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use(bodyParser.json());

// serve the api docs using swagger-ui-express

// server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// implement the loggger
server.use(loggerMiddleware);

// We need to call our routers to divide the multiple requests coming from clients

// for any end point localhost/api/product redirect to ProductController Routes

server.use("/api/users", userRouters);
server.use("/api/products", jwtAuth, productRouters);
server.use("/api/cartItems", jwtAuth, cartRouters);
server.use("/api/orders", jwtAuth, orderRouter);

server.get("/", (req, res) => {
  return res.send("Welcome to Ecommerce APIs");
});

// handling Error at appication level

server.use(appLevelErrorMiddleware);

// handling 404 if req url not matched with any existing routes

server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. please try this end point for our documentation localhost:4200/api-docs"
    );
});

server.listen(port, () => {
  console.log("server is listening on port", port);
  connectToMongoDB();
});
