// const path = require('path')
const express = require('express')
const shopController = require('../controllers/products')
const isAuthMiddleware = require('../middlewares/isAuth')

const shopRouter = express.Router()

shopRouter.get('/', shopController.getIndexController)

shopRouter.get('/products', shopController.getProductsController)

shopRouter.get('/cart', isAuthMiddleware, shopController.getCartController)

shopRouter.post('/add-to-cart', isAuthMiddleware, shopController.postAddToCartController)

shopRouter.get('/orders', isAuthMiddleware, shopController.getOrdersController)

shopRouter.get('/checkout', isAuthMiddleware, shopController.getCheckoutController)

shopRouter.get('/checkout/success', isAuthMiddleware, shopController.postOrderController)

shopRouter.get('/checkout/cancel', isAuthMiddleware, shopController.getCheckoutController)

shopRouter.get('/product/:productId', shopController.getSingleProductController)

shopRouter.get('/cart/delete-product/:productId', shopController.deleteCartProduct)

shopRouter.post('/create-order', isAuthMiddleware, shopController.postOrderController)

shopRouter.get('/order-invoice/:orderId', isAuthMiddleware, shopController.getDownloadOrderInvoice)

module.exports = shopRouter