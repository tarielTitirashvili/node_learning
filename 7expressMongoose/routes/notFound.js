const express = require('express')
const { getNotFoundController, getServerErrorPageController } = require('../controllers/notFound')

const notFoundRouter = express.Router()

notFoundRouter.get('/500', getServerErrorPageController)

notFoundRouter.use(getNotFoundController)

module.exports = notFoundRouter