// const path = require('path')
const express = require('express')

const adminController = require('../controllers/admin')

const adminRouter = express.Router()


adminRouter.get('/add-product', adminController.getAddProductController)

adminRouter.post('/add-product', adminController.postAddProductController)

adminRouter.get('/products', adminController.getProductsForAdminController)

module.exports = {
  adminRouter,
}