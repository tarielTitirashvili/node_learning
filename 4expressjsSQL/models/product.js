const fs = require('fs')
const path = require('path')
const rotDir = require('../util/path')
const { CartProduct } = require('./cart')

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
    this.imageURL = imageURL || 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
    this.description = description || ''
    this.price = price || ''
  }
  save() {

    // const productsFilePath = path.join(rotDir, 'data', 'products.json')
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductId = products.findIndex(product => product.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductId] = this
        fs.writeFile(productsFileDir, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.error(err)
          }
        })
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(productsFileDir, JSON.stringify(products), (err) => {
          if (err) {
            console.error(err)
          }
        })
      }
    })
  }
  static delete(productId) {
    getProductsFromFile(products => {
      const productPrice = products.find(product => product.id === productId)
      const filteredProducts = products.filter(product => product.id !== productId)
      fs.writeFile(productsFileDir, JSON.stringify(filteredProducts), (err) => {
        if (err) {  
          console.error(err)
        }
        CartProduct.delete(productId, productPrice.price, true)
      })
    })
  }
  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
  static fetchSingleProduct(id, cb = () => { }) {
    getProductsFromFile((products) => {
      const selectedProduct = products.find(product => product.id === id) || null
      return cb(selectedProduct)
    })
  }
}

module.exports = Product