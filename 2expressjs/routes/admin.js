// const path = require('path')
const express = require('express')

const rootDir = require('../util/path')
console.log(rootDir)
const adminRouter = express.Router()

const products = []

adminRouter.get('/add-product', (req, res, next)=>{
  console.log('middleware!')
  // ! with pug engine
  res.render('pug/add-products')
  // ! old way without Templating engine
  // res.sendFile(path.join(rootDir, 'views', 'html', 'add-product.html'))
})

adminRouter.post('/add-product',(req, res, next)=>{
  console.log('always running middleware!')
  console.log('req.body', req.body)
  products.push(req.body)
  try{
    res.redirect('/admin/add-product')
  } catch (e) {
    console.error('tariel', e)
  }
  next()
})

module.exports = {
  adminRouter,
  products
}