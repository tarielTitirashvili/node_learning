const Order = require('../models/order')
const Product = require('../models/product')
// const User = require('../models/user')

const getProductsController = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/product-list', {
      docTitle: 'shop',
      products,
      path: '/products',
      isLoggedIn: req.session.isLoggedIn
    })
  }).catch(err => console.error(err))
}

const getIndexController = (req, res, next) => {
  Product.find().then(products => {
    // console.log(req.session.isLoggedIn)
    res.render('shop/index', {
      docTitle: 'shop',
      products,
      path: '/',
    })
  }).catch(err => console.error(err))

}

const getCartController = (req, res, next) => {

  req.user.populate('cart.items.productId')
    // .execPopulate() //! might need in some cases
    .then(cartProducts => {
      console.log(cartProducts.cart.items)
      res.render('shop/cart', {
        docTitle: 'cart',
        path: '/cart',
        products: cartProducts.cart.items,
        total: 1, //cartData.totalPrice
        isLoggedIn: req.session.isLoggedIn
      })
    })
    .catch(err => console.error(err))
}

const postAddToCartController = (req, res, next) => {

  const productId = req.body.productId

  Product
    .findById(productId)
    .then(product => {
      req.user
        .addToCart(product)
        .then(DBRes => {
          console.log('DBRes', DBRes)
          res.redirect('/cart')
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
}

const getOrdersController = (req, res, next) => {
  // console.log(req.user)
  Order
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      console.log('orders.orderItem', orders[0].products)
      res.render('shop/orders', {
        docTitle: 'orders',
        path: '/orders',
        orders,
        isLoggedIn: req.session.isLoggedIn
      })
    })
    .catch(err => console.error(err))
}

const getSingleProductController = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId).then(
    product => {
      console.log(product)
      res.render('shop/product-details', {
        docTitle: 'orders',
        path: '/orders',
        product,
        isLoggedIn: req.session.isLoggedIn
      })
    }
  ).catch(err => { console.error(err) })
}

const getCheckoutController = (req, res, next) => {

  res.render('shop/checkout', {
    docTitle: 'checkout',
    path: '/checkout',
    isLoggedIn: req.session.isLoggedIn
  })
}

const deleteCartProduct = (req, res, next) => {
  const productId = req.params.productId
  // const price = req.body.price

  req.user.removeFromCart(productId)
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

  req.user
    .populate('cart.items.productId', '-userId')
    .then(cartProducts => {
      const orderProducts = cartProducts.cart.items.map(cartProduct => {
        return {
          product: cartProduct.productId._doc,
          quantity: cartProduct.quantity,
        }
      })

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: orderProducts,
      })
      return order.save()
    })
    .then((DBRes) => {
      req.user.cart.items = []
      req.user
        .save()
        .then(DBRes => {
          res.redirect('/orders')
        })
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