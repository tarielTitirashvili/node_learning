const path = require('path')
const express = require('express')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next)=>{
  res.status(404).sendFile(path.join(__dirname, '../', 'views', 'notFound.html'))
})

module.exports = notFoundRouter