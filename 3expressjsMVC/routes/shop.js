// const path = require('path')
const express = require('express')
const { getProductsController } = require('../controllers/products')

const shopRouter = express.Router()

shopRouter.get('/', getProductsController)

module.exports = shopRouter