const Order = require('../models/order')
const Product = require('../models/product')
// const User = require('../models/user')
const fs = require('fs')
const path = require('path')
const PdfDocument = require('pdfkit')

const DEFAULT_ITEMS_PER_PAGE = 2

const getProductsController = (req, res, next) => {
  let page = req.query.page
  page = +page || 1
  let productsCount = null
  Product.find()
    .countDocuments({})
    .then((count) => {
      productsCount = count
      return Product.find()
        .skip((page - 1) * DEFAULT_ITEMS_PER_PAGE)
        .limit(DEFAULT_ITEMS_PER_PAGE)
    })
    .then(products => {
      const lastPage = Math.ceil(productsCount / DEFAULT_ITEMS_PER_PAGE)
      res.render('shop/product-list', {
        docTitle: 'shop',
        products,
        path: '/products',
        productsCount: productsCount,
        hasNextPage: page < lastPage,
        prevPage: page - 1,
        currentPage: page,
        nextPage: page + 1,
        lastPage: lastPage
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
}

const getIndexController = (req, res, next) => {
  let page = req.query.page
  page = +page || 1
  let productsCount = null
  Product.find()
    .countDocuments({})
    .then((count) => {
      productsCount = count
      return Product.find()
        .skip((page - 1) * DEFAULT_ITEMS_PER_PAGE)
        .limit(DEFAULT_ITEMS_PER_PAGE)
    })
    .then(products => {
      // console.log(req.session.isLoggedIn)
      const lastPage = Math.ceil(productsCount / DEFAULT_ITEMS_PER_PAGE)
      res.render('shop/index', {
        docTitle: 'shop',
        products,
        path: '/',
        productsCount: productsCount,
        hasNextPage: page < lastPage,
        prevPage: page - 1,
        currentPage: page,
        nextPage: page + 1,
        lastPage: lastPage
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })

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
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
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
        .catch(err => {
          const error = new Error(err)
          error.httpStatusCode = 500
          next(error)
        })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
}

const getOrdersController = (req, res, next) => {
  // console.log(req.user._id)
  Order
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      // console.log('orders.orderItem', orders)
      res.render('shop/orders', {
        docTitle: 'orders',
        path: '/orders',
        orders,
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
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
      })
    }
  )
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
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
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
}

const getDownloadOrderInvoice = (req, res, next) => {
  const orderId = req.params.orderId

  Order.findById(orderId)
    .then(order => {
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized.'))
      }
      if (!order) {
        return next(new Error('No order found.'))
      }
      const invoiceName = 'invoice-' + orderId + '.pdf'
      const invoicePath = path.join('data', 'invoices', invoiceName)
      // const file = fs.createReadStream(invoicePath)
      const invoiceDocument = new PdfDocument()
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '')
      invoiceDocument.pipe(fs.createWriteStream(invoicePath))
      invoiceDocument.pipe(res)
      invoiceDocument.fontSize(24).text('Tariel', {
        underline: true
      })
      invoiceDocument.text('-------------------------------------')
      console.log('order', order)
      order.products.map(order => {
        invoiceDocument.fontSize(14).text('ordered item: ' + order.product.title + ' price: ' + order.product.price * order.quantity + ' one product Price: ' + order.product.price)
      })
      invoiceDocument.end()
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
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
  getDownloadOrderInvoice,
}