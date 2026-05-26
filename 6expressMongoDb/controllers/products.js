const Product = require('../models/product')
const User = require('../models/user')

const getProductsController = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/product-list', {
      docTitle: 'shop',
      products,
      path: '/products',
    })
  }).catch(err => console.error(err))
}

const getIndexController = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('shop/index', {
      docTitle: 'shop',
      products,
      path: '/',
    })
  }).catch(err => console.error(err))

}

const getCartController = (req, res, next) => {

  req.user.getCart()
    .then(cartProducts => {
      res.render('shop/cart', {
        docTitle: 'cart',
        path: '/cart',
        products: cartProducts,
        total: 1 //cartData.totalPrice
      })
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err))
}

const postAddToCartController = (req, res, next) => {

  const productId = req.body.productId

  Product.findProduct(productId).then(
    product => {
      return req.user.addToCart(product)
        .then(DBRes => {
          console.log('added to cart response TARIEL', DBRes)

          return DBRes
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.error(err))
    }
  ).catch(err => console.error(err))
}

const getOrdersController = (req, res, next) => {
  req.user.getOrders()
    .then(orders => {
      console.log('orders.orderItem', orders)
      res.render('shop/orders', {
        docTitle: 'orders',
        path: '/orders',
        orders
      })
    })
}

const getSingleProductController = (req, res, next) => {
  const productId = req.params.productId
  Product.findProduct(productId).then(
    product => {
      console.log(product)
      res.render('shop/product-details', {
        docTitle: 'orders',
        path: '/orders',
        product
      })
    }
  ).catch()
}

const getCheckoutController = (req, res, next) => {

  res.render('shop/checkout', {
    docTitle: 'checkout',
    path: '/checkout',
  })
}

const deleteCartProduct = (req, res, next) => {
  const productId = req.params.productId
  // const price = req.body.price

  req.user.deleteItemFromCart(productId)
    .then(products => {
      res.redirect('/cart')
      return products
    })
    .catch(err => {
      res.redirect('/cart')
      console.error(err)
    })
}

const postOrderController = (req, res, next) => {
  req.user.order()
    .then(result => {
      res.redirect('/orders')
      return result
    })
    .catch(err => console.error(err))
}

module.exports = {
  getProductsController,
  getIndexController,
  getCartController,
  postAddToCartController,
  getCheckoutController,
  getSingleProductController,
  getOrdersController,
  deleteCartProduct,
  postOrderController,
}