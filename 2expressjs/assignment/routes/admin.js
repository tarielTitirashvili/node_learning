const express = require('express')
const path = require('path')
const rootDir = require('../utils/rootDir')

const usersRouter = express.Router()

usersRouter.get('/users', (req, res, next)=>{
  res.sendFile(path.join(rootDir, 'views', 'users.html'))
})

module.exports = usersRouter