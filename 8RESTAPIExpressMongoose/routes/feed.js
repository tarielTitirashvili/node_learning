const express = require('express')
const { getFeedController, postCreatePost } = require('../controllers/feed')

const feedRouter = express.Router()
// GET /feed/post
feedRouter.get('/posts', getFeedController)
// POST /feed/post
feedRouter.post('/posts', postCreatePost)
 
module.exports = feedRouter