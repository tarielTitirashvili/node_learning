// const path = require('path')
const express = require('express')

const adminController = require('../controllers/admin')

const adminRouter = express.Router()
const isAuthMiddleware = require('../middlewares/isAuth')
const { body } = require('express-validator')

productValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('can be from 3 to 50 characters'),

  body('imageURL')
    .trim()
    .isLength({ min: 0, max: 800 })
    .withMessage('can be from 3 to 800 characters')
    .isURL()
    .withMessage('not valid URL!'),

  body('price')
    .trim()
    .isNumeric()
    .withMessage('must be numeric'),

  body('description')
    .trim()
    .isLength({ min: 8, max: 800 })
    .withMessage('can be from 8 to 800 characters'),
]

adminRouter.get('/add-product', isAuthMiddleware, adminController.getAddProductController)

adminRouter.post(
  '/add-product',
  isAuthMiddleware,
  productValidation,
  adminController.postAddProductController
)

adminRouter.get('/edit-product/:productId', isAuthMiddleware, adminController.getEditProductController)

adminRouter.post('/edit-product', isAuthMiddleware, productValidation, adminController.postEditProductController)

adminRouter.get('/products', isAuthMiddleware, adminController.getProductsForAdminController)

adminRouter.post('/delete-product', isAuthMiddleware, adminController.deleteProductController)

module.exports = adminRouter