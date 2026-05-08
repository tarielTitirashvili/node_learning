// const path = require('path')
const express = require('express')

const rootDir = require('../util/path')
console.log(rootDir)
const adminRouter = express.Router()

const products = []

adminRouter.get('/add-product', (req, res, next) => {

  res.render('add-product', { path: '/admin/add-product', docTitle: 'Add Product' })
})

adminRouter.post('/add-product', (req, res, next) => {
  try {
    console.log('req.body', req.body)
    products.push(req.body)
    res.redirect('/')
  } catch (e) {
    console.error('error ', e)
  }
})

module.exports = {
  adminRouter,
  products
}