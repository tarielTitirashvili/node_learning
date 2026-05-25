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
    .then(cart => {
      return cart.getProducts()
    }).then(cartProducts => {
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
  req.user.getOrders({ include: ['products'] })
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
  const productId = req.body.id
  // const price = req.body.price
  let userCart

  req.user.getCart()
    .then(cart => {
      userCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      if (products.length) {
        const product = products[0]
        product.cartItem.destroy()
      }
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err))


  res.redirect('/cart')
}
const postOrderController = (req, res, next) => {
  let userCart
  req.user.getCart()
    .then(cart => {
      userCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
    })
    .then(result => {
      console.log(result)
      return userCart.setProducts(null)
    })
    .then(result => {
      console.log(result)
      return res.redirect('/orders')
    })
    .catch(err => console.error(err))
    .catch(err => console.error(err))
    .catch(err => {
      console.error(err)
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
}