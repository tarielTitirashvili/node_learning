const Product = require('../models/product')

const getProductsController = (req, res, next) => {

  Product.fetchAll((products) => {
    console.log('products', products)

    res.render('shop/product-list', {
      docTitle: 'shop',
      products,
      path: '/products',
    })
  })
}

const getIndexController = (req, res, next) => {

  Product.fetchAll((products) => {
    console.log('products', products)

    res.render('shop/index', {
      docTitle: 'shop',
      products,
      path: '/',
    })
  })
}

const getCartController = (req, res, next) => {

  res.render('shop/cart', {
    docTitle: 'cart',
    path: '/cart',
  })
}

const getOrdersController = (req, res, next) => {

  res.render('shop/orders', {
    docTitle: 'orders',
    path: '/orders',
  })
}

const getSingleProductController = (req, res, next) => {
  console.log(req.params.productId)
  res.render('shop/product-details', {
    docTitle: 'orders',
    path: '/orders',
  })
}

const getCheckoutController = (req, res, next) => {

  res.render('shop/checkout', {
    docTitle: 'checkout',
    path: '/checkout',
  })
}


module.exports = {
  getProductsController,
  getIndexController,
  getCartController,
  getCheckoutController,
  getSingleProductController,
  getOrdersController
}