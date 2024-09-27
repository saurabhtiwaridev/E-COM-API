import ApplicationError from "../../error-handling/applicationError.js";
import ProductModel from "./product.model.js";
import PorductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRopository = new PorductRepository();
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.productRopository.getAll();

      return res.status(200).send(products);
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error in while fetching all the product",
        500
      );
    }
  }

  async createNewProduct(req, res) {
    try {
      const { name, desc, price, categories } = req.body;

      const savedProduct = await this.productRopository.addProduct(
        name,
        desc,
        price,
        categories
      );
      return res.status(201).send(savedProduct);
    } catch (error) {
      console.log(error);
      throw new ApplicationError("error in creating product", 500);
    }
  }

  async averagePrice(req, res) {
    try {
      const result = await this.productRopository.avergaePriceCategoryWise();

      return res.status(200).send(result);
    } catch (error) {
      throw new ApplicationError(
        "error while calculating average price of product , category wise",
        500
      );
    }
  }

  async averageRatings(req, res) {
    try {
      const result = await this.productRopository.averageRatingsOfProducts();

      return res.status(200).send(result);
    } catch (error) {
      throw new ApplicationError(
        "error while calculating average ratings of product , category wise",
        500
      );
    }
  }

  async countRatings(req, res) {
    try {
      const result = await this.productRopository.countOfRatingsProductWise();

      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error while calculating average ratings of product , category wise",
        500
      );
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;

      const product = await this.productRopository.getProductById(id);

      return res.status(200).send(product);
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error occured while filterting the product with id",
        500
      );
    }
  }

  async filterProduct(req, res) {
    try {
      const { minPrice, category } = req.query;

      const filteredProduct = await this.productRopository.filter(
        Number(minPrice),
        // Number(maxPrice),
        category
      );

      res.status(200).send(filteredProduct);
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "error while filerting out the product in the db",
        500
      );
    }
  }

  async rateProduct(req, res) {
    try {
      const { productId, rate } = req.body;
      await this.productRopository.rateProduct(req.userId, productId, rate);

      return res.status(200).send("product rated successfully...!");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("erro whle rating", 500);
    }
  }
}
