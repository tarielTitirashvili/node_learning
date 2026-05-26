// const path = require('path')
const express = require('express')
const shopController = require('../controllers/products')

const shopRouter = express.Router()

shopRouter.get('/', shopController.getIndexController)

shopRouter.get('/products', shopController.getProductsController)

// shopRouter.get('/cart', shopController.getCartController)

// shopRouter.post('/add-to-cart', shopController.postAddToCartController)

// shopRouter.get('/orders', shopController.getOrdersController)

// shopRouter.get('/checkout', shopController.getCheckoutController)

shopRouter.get('/product/:productId', shopController.getSingleProductController)

// shopRouter.get('/cart/delete-product/:productId', shopController.deleteCartProduct)

// shopRouter.post('/create-order', shopController.postOrderController)

module.exports = shopRouter