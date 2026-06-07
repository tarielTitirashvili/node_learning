// const path = require('path')
const express = require('express')

const adminController = require('../controllers/admin')

const adminRouter = express.Router()
const isAuthMiddleware = require('../middlewares/isAuth')

adminRouter.get('/add-product', isAuthMiddleware, adminController.getAddProductController)

adminRouter.post('/add-product', isAuthMiddleware, adminController.postAddProductController)

adminRouter.get('/edit-product/:productId', isAuthMiddleware, adminController.getEditProductController)

adminRouter.post('/edit-product', isAuthMiddleware, adminController.postEditProductController)

adminRouter.get('/products', isAuthMiddleware, adminController.getProductsForAdminController)

adminRouter.post('/delete-product', isAuthMiddleware, adminController.deleteProductController)

module.exports = adminRouter