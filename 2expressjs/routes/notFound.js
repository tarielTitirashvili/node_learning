const express = require('express')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next)=>{
  res.status(404).send('<h1>not found</h1>')
})

module.exports = notFoundRouter