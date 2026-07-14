const express = require('express')
const { getFeedController, postCreatePost, getPostController, updatePostController, deletePostController } = require('../controllers/feed')
const { body } = require('express-validator')
const { isAuth } = require('../middleware/is-auth')

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
  isAuth,
  getFeedController
)

feedRouter.get('/post/:postId', getPostController)

// POST /feed/post
feedRouter.post(
  '/posts',
  isAuth,
  postValidation,
  postCreatePost
)

feedRouter.put('/post/:postId', isAuth, postValidation, updatePostController)

feedRouter.delete('/post/:postId', isAuth, deletePostController)

module.exports = feedRouter