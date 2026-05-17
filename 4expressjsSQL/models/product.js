const fs = require('fs')
const path = require('path')
const rotDir = require('../util/path')
const { CartProduct } = require('./cart')
const db = require('../util/database')

const productsFileDir = path.join(rotDir, 'data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(productsFileDir, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    return cb(JSON.parse(fileContent))
  })
}

class Product {

  constructor(id, productTitle, imageURL, description, price) {
    this.id = id
    this.title = productTitle
    this.imageUrl = imageURL || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
    this.description = description || ''
    this.price = price || ''
  }
  save() {
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    )
  }
  static delete(productId) {

  }
  static fetchAll(cb) {
    return db.execute('SELECT * FROM products')
  }
  static fetchSingleProduct(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }
}

module.exports = Product