const express = require('express')
const { getFeedController, postCreatePost, getPostController, updatePostController } = require('../controllers/feed')
const { body } = require('express-validator')

const feedRouter = express.Router()
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 60 })
    .withMessage('can be from 5 to 60 characters'),
  body('content')
    .trim()
    .isLength({ min: 5, max: 400 })
    .withMessage('can be from 5 to 60 characters'),
]
// GET /feed/post
feedRouter.get(
  '/posts',
  getFeedController
)
// POST /feed/post
feedRouter.post(
  '/posts',
  postValidation,
  postCreatePost
)

feedRouter.get('/post/:postId', getPostController)

feedRouter.put('/post/:postId', postValidation, updatePostController)

module.exports = feedRouter