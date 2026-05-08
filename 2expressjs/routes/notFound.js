// const path = require('path')
const express = require('express')
// const rootDir = require('../util/path')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next)=>{

  res.status(404).render('ejs/not-found', {
    docTitle: 'Page Not Found'
  })
  // ! old way without Templating engine
  // res.sendFile(path.join(rootDir, 'views', 'html', 'not-found.html'))
})

module.exports = notFoundRouter