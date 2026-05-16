// const path = require('path')
const express = require('express')
const shopController = require('../controllers/products')

const shopRouter = express.Router()

shopRouter.get('/', shopController.getIndexController)

shopRouter.get('/products', shopController.getProductsController)

shopRouter.get('/cart', shopController.getCartController)

shopRouter.post('/add-to-cart', shopController.addToCartController)

shopRouter.get('/orders', shopController.getOrdersController)

shopRouter.get('/checkout', shopController.getCheckoutController)

shopRouter.get('/product/:productId', shopController.getSingleProductController)

shopRouter.post('/cart/delete-product', shopController.deleteCartProduct)

module.exports = shopRouter