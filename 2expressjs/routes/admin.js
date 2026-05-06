const path = require('path')
const express = require('express')

const rootDir = require('../util/path')
console.log(rootDir)
const adminRouter = express.Router()

adminRouter.get('/add-product', (req, res, next)=>{
  console.log('middleware!')
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

adminRouter.post('/product',(req, res, next)=>{
  console.log('always running middleware!')
  console.log('req.body', req.body)
  try{
    res.redirect('/admin/add-product')
  } catch (e) {
    console.error('tariel', e)
  }
  next()
})

module.exports = adminRouter