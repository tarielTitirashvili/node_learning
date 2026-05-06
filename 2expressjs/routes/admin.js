const express = require('express')

const adminRouter = express.Router()

adminRouter.get('/add-product', (req, res, next)=>{
  console.log('middleware!')
  res.send('<form action="/admin/product" method="POST"><input type="text" name="message"></input><button type="submit">submit</button></form>')
})

adminRouter.post('/product',(req, res, next)=>{
  console.log('always running middleware!')
  console.log('req.body', req.body)
  res.redirect('/admin/add-product')
  next()
})

module.exports = adminRouter