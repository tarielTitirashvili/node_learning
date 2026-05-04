// ! core
const http = require('http')
// ! 3rd party
const express = require('express')

const app = express()
app.use((req, res, next)=>{
  console.log('always running middleware!')
  next()
})

app.use('/add-product', (req, res, next)=>{
  console.log('middleware!')
  res.send('<h1>Add Product page!!!</h1>')
  // if we call here next execution will continue to next middlewares
})

app.use('/', (req, res, next)=>{
  console.log('middleware!')
  res.send('<h1>Hello!!!</h1>')
})

app.listen(9000)
