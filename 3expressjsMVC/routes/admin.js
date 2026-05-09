// const path = require('path')
const express = require('express')

const rootDir = require('../util/path')
const { getAddProductController, postAddProductController } = require('../controllers/products')
console.log(rootDir)
const adminRouter = express.Router()


adminRouter.get('/add-product', getAddProductController)

adminRouter.post('/add-product', postAddProductController)

module.exports = {
  adminRouter,
}