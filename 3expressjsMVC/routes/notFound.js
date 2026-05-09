const express = require('express')
const getNotFoundController = require('../controllers/notFound')

const notFoundRouter = express.Router()

notFoundRouter.use(getNotFoundController)

module.exports = notFoundRouter