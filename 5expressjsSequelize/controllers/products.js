const { CartProduct } = require('../models/cart')
const Product = require('../models/product')

const getProductsController = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      docTitle: 'shop',
      products,
      path: '/products',
    })
  }).catch(err => console.error(err))
}

const getIndexController = (req, res, next) => {
  Product.findAll().then(products => {
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
  let userCart
  req.user.getCart()
    .then(cart => {
      userCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      let product
      if (products.length) {
        product = products[0]
      }
      let newQuantity = 1
      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        userCart.addProduct(product, { trough: { quantity: newQuantity } })
      }

      return Product
        .findByPk(productId)
        .then(product => {
          return userCart.addProduct(product, { through: { quantity: newQuantity } })
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.error(err))
        .catch(err => console.error(err))

    })
    .catch(err => console.error(err))

  // Product.fetchSingleProduct(productId, (product) => {
  //   CartProduct.addProduct(productId, product.price, )
  // })
}

const getOrdersController = (req, res, next) => {

  res.render('shop/orders', {
    docTitle: 'orders',
    path: '/orders',
  })
}

const getSingleProductController = (req, res, next) => {
  const productId = req.params.productId

  Product.findByPk(productId).then(
    product => {
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
  const price = req.body.price

  CartProduct.delete(productId, price, false)

  res.redirect('/cart')
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
}