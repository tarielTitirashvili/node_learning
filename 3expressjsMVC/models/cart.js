const fs = require('fs')
const rotDir = require('../util/path')
const path = require('path')

const cartFileDir = path.join(rotDir, 'data', 'cart.json')

const getProductsFromFile = (cb) => {
  fs.readFile(cartFileDir, (err, fileContent) => {
    if (err) {
      return cb([])
    }
    return cb(JSON.parse(fileContent))
  })
}

class CartProduct {
  static addProduct (productId, productPrice, onSuccess) {
    fs.readFile(cartFileDir, (err, cartData)=>{
      console.log(cartData)
      let cart = {products: [], totalPrice: 0}
      console.log('cartData', cartData)
      if(!err && cartData){
        cart = JSON.parse(cartData)
      }
      console.log('cart', cart)
      console.log(cart.products)
      console.log('productId', productId)
      // find product and add to cart and increase cart total
      const selectedProductIndex = cart?.products?.findIndex(product => product.id === productId)
      console.log('selectedProductIndex', selectedProductIndex)

      let updatedProduct
      if(selectedProductIndex >= 0){
        cart.products[selectedProductIndex].quantity = cart.products[selectedProductIndex].quantity + 1
      }else{
        updatedProduct = { id: productId, quantity: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + productPrice
      
      fs.writeFile(cartFileDir, JSON.stringify(cart), err =>{
        if(err){
          return console.log(err)
        }
        return
      })
    })
  }
}

module.exports = {
  CartProduct
}