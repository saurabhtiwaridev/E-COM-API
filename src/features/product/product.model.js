export default class ProductModel {
  constructor(_name, _desc, _price, _imageUrl, _category, _size, _stock) {
    this.name = _name;
    this.desc = _desc;
    this.price = _price;
    this.imageUrl = _imageUrl;
    this.categories = _category;
    this.size = _size;
    this.stock = _stock;
  }
}
