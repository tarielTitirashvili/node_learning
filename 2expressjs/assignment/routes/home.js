const express = require('express')
const path = require('path')
const rootDir = require('../utils/rootDir')

const homeRouter = express.Router()

homeRouter.get('/', (req, res, next)=>{
  res.sendFile(path.join(rootDir, 'views', 'home.html'))
})

module.exports = homeRouter