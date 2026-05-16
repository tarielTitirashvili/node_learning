const fs = require('fs')
const rotDir = require('../util/path')
const path = require('path')
const Product = require('./product')

const cartFileDir = path.join(rotDir, 'data', 'cart.json')

const getProductsFromFile = (cb) => {
  fs.readFile(cartFileDir, (err, cartData) => {
    if (err) {
      return cb([])
    }
    const parsedCartData = JSON.parse(cartData)
    cb(parsedCartData)
  })
}

class CartProduct {
  static addProduct(productId, productPrice, onSuccess) {
    fs.readFile(cartFileDir, (err, cartData) => {

      let cart = { products: [], totalPrice: 0 }

      if (!err && cartData) {
        cart = JSON.parse(cartData)
      }

      // find product and add to cart and increase cart total
      const selectedProductIndex = cart?.products?.findIndex(product => product.id === productId)

      let updatedProduct
      if (selectedProductIndex >= 0) {
        cart.products[selectedProductIndex].quantity = cart.products[selectedProductIndex].quantity + 1
      } else {
        updatedProduct = { id: productId, quantity: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice

      fs.writeFile(cartFileDir, JSON.stringify(cart), err => {
        if (err) {
          return console.log(err)
        }
        return onSuccess()
      })
    })
  }
  static delete(productId, price, productIsDeleted, onSuccess = () => { }) {
    getProductsFromFile(cartData => {
      console.log('cartData', cartData)
      const deletedProductIndex = cartData.products.findIndex(product => product.id === productId)
      if (productIsDeleted) {
        cartData.totalPrice = cartData.totalPrice - (+price * cartData.products[deletedProductIndex].quantity)
        cartData.products = cartData.products.filter(product => product.id !== productId)
        fs.writeFile(cartFileDir, JSON.stringify(cartData), err => {
          if (err) {
            return console.log(err)
          }
          return onSuccess()
        })
      } else {
        if (deletedProductIndex >= 0) {
          cartData.totalPrice = cartData.totalPrice - +price
          if (cartData.products[deletedProductIndex].quantity > 1) {
            cartData.products[deletedProductIndex].quantity = cartData.products[deletedProductIndex].quantity - 1
          } else {
            cartData.products = cartData.products.filter(product => product.id !== productId)
          }
          fs.writeFile(cartFileDir, JSON.stringify(cartData), err => {
            if (err) {
              return console.log(err)
            }
            return onSuccess()
          })
        } else {
          return
        }
      }
    })
  }
  static getCartData(cb) {
    getProductsFromFile(cb)
  }
}

module.exports = {
  CartProduct
}