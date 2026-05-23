// const path = require('path')
const express = require('express')

const adminController = require('../controllers/admin')

const adminRouter = express.Router()


adminRouter.get('/add-product', adminController.getAddProductController)

adminRouter.post('/add-product', adminController.postAddProductController)

adminRouter.get('/edit-product/:productId', adminController.getEditProductController)

adminRouter.post('/edit-product', adminController.postEditProductController)

adminRouter.get('/products', adminController.getProductsForAdminController)

adminRouter.post('/delete-product', adminController.deleteProductController)

module.exports = {
  adminRouter,
}