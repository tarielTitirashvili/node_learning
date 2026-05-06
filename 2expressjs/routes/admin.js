const path = require('path')
const express = require('express')

const adminRouter = express.Router()

adminRouter.get('/add-product', (req, res, next)=>{
  console.log('middleware!')
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
})

adminRouter.post('/product',(req, res, next)=>{
  console.log('always running middleware!')
  console.log('req.body', req.body)
  res.redirect('/admin/add-product')
  next()
})

module.exports = adminRouter