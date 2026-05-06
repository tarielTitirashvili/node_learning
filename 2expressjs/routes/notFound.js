const path = require('path')
const express = require('express')
const rootDir = require('../util/path')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next)=>{
  res.sendFile(path.join(rootDir, 'views', 'notFound.html'))
})

module.exports = notFoundRouter