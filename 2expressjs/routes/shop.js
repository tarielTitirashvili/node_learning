const path = require('path')
const express = require('express')
const { products } = require('./admin')
//! const rootDir = require('../util/path')

const shopRouter = express.Router()

shopRouter.get('/', (req, res, next)=>{
  console.log('middleware!')
  //! rootDir is alternative for __dirname, '..',
  products
  res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'))
})

module.exports = shopRouter