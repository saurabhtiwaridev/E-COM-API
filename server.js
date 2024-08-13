import express from "express";
import productRouters from "./src/features/product/product.router.js";
import bodyParser from "body-parser";
import userRouters from "./src/features/user/user.router.js";
import basicAuthroizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

const port = 4200;

const server = express();

server.use(bodyParser.json());

// We need to call our routers to divide the multiple requests coming from clients

// for any end point localhost/api/product redirect to ProductController Routes

server.use("/api/products", jwtAuth, productRouters);
server.use("/api/users", userRouters);

server.get("/", (req, res) => {
  return res.send("Welcome to Ecommerce APIs");
});

server.listen(port, () => {
  console.log("server is listening on port", port);
});
