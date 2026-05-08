// const path = require('path')
const express = require('express')

const rootDir = require('../util/path')
console.log(rootDir)
const adminRouter = express.Router()

const products = []

adminRouter.get('/add-product', (req, res, next) => {
  console.log('middleware!')
  // ! with pug engine
  res.render('ejs/add-product', { path: '/admin/add-product', docTitle: 'Add Product', activeAddProduct: true })
  // ! old way without Templating engine
  // res.sendFile(path.join(rootDir, 'views', 'html', 'add-product.html'))
})

adminRouter.post('/add-product', (req, res, next) => {
  try {
    console.log('always running middleware!')
    console.log('req.body', req.body)
    products.push(req.body)
    res.redirect('/')
  } catch (e) {
    console.error('error', e)
  }
})

module.exports = {
  adminRouter,
  products
}