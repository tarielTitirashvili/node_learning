const fs = require('fs')
const path = require('path')
const rotDir = require('../util/path')

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

  constructor(productTitle, imageURL, description, price) {
    this.title = productTitle
    this.imageURL = imageURL || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
    this.description = description || ''
    this.price = price || ''
  }
  save() {
    this.id = Math.random().toString()
    // const productsFilePath = path.join(rotDir, 'data', 'products.json')
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(productsFileDir, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  }
  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
  static fetchSingleProduct(id, cb = () => {}) {
    getProductsFromFile((products) => {
      const selectedProduct = products.find(product => product.id === id) || null
      return cb(selectedProduct)
    })
  }
}

module.exports = Product