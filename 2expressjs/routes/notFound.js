// const path = require('path')
const express = require('express')
// const rootDir = require('../util/path')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next)=>{

  res.render('pug/not-found')
  // ! old way without Templating engine
  // res.sendFile(path.join(rootDir, 'views', 'html', 'not-found.html'))
})

module.exports = notFoundRouter