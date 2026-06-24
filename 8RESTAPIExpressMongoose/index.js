const express = require('express')
const bodyParser = require('body-parser')

const feedRouter = require('./routes/feed')

const app = express()

app.use(bodyParser.json())

const allowedOrigins = [
  'https://codepen.io',
  'https://cdpn.io',
]
app.use((req, res, next) => {
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  // res.setHeader('Access-Control-Allow-Origin', 'https://codepen.io')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/feed', feedRouter)

app.listen(9000)