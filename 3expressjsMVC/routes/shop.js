// const path = require('path')
const express = require('express')
const { products } = require('./admin')

const shopRouter = express.Router()

shopRouter.get('/', (req, res, next)=>{
  console.log('middleware!')

  console.log(products)
  res.render('shop', {
    docTitle: 'shop',
    products,
    path: '/',
  })
})

module.exports = shopRouter