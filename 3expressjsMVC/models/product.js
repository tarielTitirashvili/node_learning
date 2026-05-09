const products = []

class Product {
  constructor(productTitle){
    this.title = productTitle
  }
  save() {
    products.push(this)
  }
  static fetchAll(){
    return products
  }
}

module.exports = Product