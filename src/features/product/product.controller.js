import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.getAll();

    return res.status(200).send(products);
  }

  createNewProduct(req, res) {
    const { name, desc, price, category, size } = req.body;

    const newProductCreated = {
      name,
      desc,
      price: parseFloat(price),
      imageUrl: req.file.filename,
      category,
      size: size.split(","),
    };
    const productCreated = ProductModel.addProduct(newProductCreated);
    res.status(201).send(productCreated);
  }

  getOneProduct(req, res) {
    const { id } = req.params;
    const product = ProductModel.getProductById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send("There is no product added with given id");
    }
  }

  filterProduct(req, res) {
    const { minPrice, maxPrice, category } = req.query;
    console.log(minPrice, maxPrice, category);

    const filteredProduct = ProductModel.filter(minPrice, maxPrice, category);

    res.status(200).send(filteredProduct);
  }

  rateProduct(req, res) {}
}
