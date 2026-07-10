const express = require('express')
const { getFeedController, postCreatePost, getPostController, updatePostController, deletePostController } = require('../controllers/feed')
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

feedRouter.get('/post/:postId', getPostController)

// POST /feed/post
feedRouter.post(
  '/posts',
  postValidation,
  postCreatePost
)

feedRouter.put('/post/:postId', postValidation, updatePostController)

feedRouter.delete('/post/:postId', deletePostController)

module.exports = feedRouter