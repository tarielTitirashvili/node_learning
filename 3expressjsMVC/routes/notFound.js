// const path = require('path')
const express = require('express')
// const rootDir = require('../util/path')

const notFoundRouter = express.Router()

notFoundRouter.use((req, res, next) => {

  res.status(404).render('not-found', {
    path: 'null',
    docTitle: 'Page Not Found',
  })
})

module.exports = notFoundRouter