const express = require('express')
const { getFeedController } = require('../controllers/feed')

const feedRouter = express.Router()

feedRouter.get('/posts', getFeedController)

module.exports = feedRouter