const { validationResult } = require('express-validator')

const Post = require('../models/posts')

const getFeedController = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect!',
      errors: errors.array()
    })
  }

  Post.find()
    .then(posts => {
      res.json({ message: 'fetching posts', posts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
  // res.status(200).json({
  //   posts: [{
  //     _id: '1',
  //     title: 'title',
  //     content: 'some random content!',
  //     imageUrl: 'images/image.jpg',
  //     creator: {
  //       name: 'tariel'
  //     },
  //     date: new Date()
  //   }]
  // })
}

const postCreatePost = (req, res, next) => {
  const errors = validationResult(req)
  // console.log('errors', errors)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect!')
    error.statusCode = 422
    throw error
  }

  if (!req.file) {
    const error = new Error('Validation failed, Fail is required')
    error.statusCode = 422
    throw error
  }

  const { title, content } = req.body
  const post = new Post({
    title: title,
    content: content,
    imageUrl: req.file.path,
    creator: {
      name: 'ტარიელ'
    },
  })

  post.save()
    .then(dbRes => {
      // console.log('dbRes', dbRes)
      res.status(201).json({
        message: 'post created',
        post: post
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const getPostController = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('post was not found!')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({ message: 'post fetched', post })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}


module.exports = {
  getFeedController,
  postCreatePost,
  getPostController
}