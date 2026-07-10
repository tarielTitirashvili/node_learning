const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

const Post = require('../models/posts')

const deleteImage = oldFilePath => {
  const filepath = path.join(__dirname, '..', oldFilePath)
  return fs.unlink(filepath, err => console.error(err))
}

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

const updatePostController = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect!')
    error.statusCode = 422
    throw error
  }

  if (!req.file && !req.body.image) {
    const error = new Error('Validation failed, Fail is required')
    error.statusCode = 422
    throw error
  }

  const { title, content } = req.body
  const postId = req.params.postId
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path
  }

  if (!imageUrl) {
    const error = new Error('No file picked.')
    error.statusCode = 422
    throw error
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found!')
        error.statusCode = 404
        throw error
      }
      if (imageUrl !== post.imageUrl) {
        deleteImage(post.imageUrl)
      }
      post.title = title
      post.content = content
      post.imageUrl = imageUrl
      return post.save()
    })
    .then(updatedPost => {
      return res.status(200).json({
        message: 'post updated',
        post: updatedPost
      })
    })
    .catch((err) => {
      if (req.file) {
        deleteImage(req.file.path)
      }
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const deletePostController = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found!')
        error.statusCode = 404
        throw error
      }
      deleteImage(post.imageUrl)
      return Post.findByIdAndDelete(postId)
    })
    .then(result => {
      return res.status(200).json({
        message: 'post deleted',
        post: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}


module.exports = {
  getFeedController,
  postCreatePost,
  getPostController,
  updatePostController,
  deletePostController
}