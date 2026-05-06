const express = require('express')

const shopRouter = express.Router()

shopRouter.get('/', (req, res, next)=>{
  console.log('middleware!')
  res.send('<h1>Hello!!!</h1>')
})

module.exports = shopRouter