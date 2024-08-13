export default class ProductModel {
  constructor(_id, _name, _desc, _price, _imageUrl, _category, _size) {
    this.id = _id;
    this.name = _name;
    this.desc = _desc;
    this.price = _price;
    this.imageUrl = _imageUrl;
    this.category = _category;
    this.size = _size;
  }

  static getAll() {
    return products;
  }

  static addProduct(product) {
    product.id = products.length + 1;

    products.push(product);
    return product;
  }

  static getProductById(id) {
    const product = products?.find((prod) => {
      return prod?.id == id;
    });

    if (product) {
      return product;
    } else {
      return null;
    }
  }

  static filter(minPrice, maxPrice, category) {
    const filteredProduct = products?.filter((product) => {
      return (
        (!minPrice || product?.price >= minPrice) &&
        (!maxPrice || product?.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });

    return filteredProduct;
  }
}

const products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    20,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Category 1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    30,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Category 2",
    ["XL", "XXL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    40,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category 3",
    ["M", "L", "XL"]
  ),
];
