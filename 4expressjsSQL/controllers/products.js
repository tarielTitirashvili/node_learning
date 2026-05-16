const { CartProduct } = require('../models/cart')
const Product = require('../models/product')

const getProductsController = (req, res, next) => {

  Product.fetchAll((products) => {

    res.render('shop/product-list', {
      docTitle: 'shop',
      products,
      path: '/products',
    })
  })
}

const getIndexController = (req, res, next) => {

  Product.fetchAll((products) => {

    res.render('shop/index', {
      docTitle: 'shop',
      products,
      path: '/',
    })
  })
}

const getCartController = (req, res, next) => {

  CartProduct.getCartData((cartData) => {
    Product.fetchAll(products => {
      const cartProducts = []
      cartData.products?.map(product =>{
        const indexOfProduct = products.findIndex(prod => prod.id === product.id)

        if(indexOfProduct>=0){
          cartProducts.push({...products[indexOfProduct], quantity: product.quantity})
        }
      })
      res.render('shop/cart', {
        docTitle: 'cart',
        path: '/cart',
        products: cartProducts,
        total: cartData.totalPrice
      })
    })
  })
}

const addToCartController = (req, res, next) => {
  const productId = req.body.productId

  Product.fetchSingleProduct(productId, (product) => {
    CartProduct.addProduct(productId, product.price, () => res.redirect('/cart'))
  })
}

const getOrdersController = (req, res, next) => {

  res.render('shop/orders', {
    docTitle: 'orders',
    path: '/orders',
  })
}

const getSingleProductController = (req, res, next) => {
  const productId = req.params.productId

  Product.fetchSingleProduct(productId, (product) => {
    res.render('shop/product-details', {
      docTitle: 'orders',
      path: '/orders',
      product
    })
  })
}

const getCheckoutController = (req, res, next) => {

  res.render('shop/checkout', {
    docTitle: 'checkout',
    path: '/checkout',
  })
}

const deleteCartProduct = (req, res, next) => {
  const productId = req.body.id
  const price = req.body.price

  CartProduct.delete(productId, price, false)
  
  res.redirect('/cart')
}

module.exports = {
  getProductsController,
  getIndexController,
  getCartController,
  addToCartController,
  getCheckoutController,
  getSingleProductController,
  getOrdersController,
  deleteCartProduct,
}