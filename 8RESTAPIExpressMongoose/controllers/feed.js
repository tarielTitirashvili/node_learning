const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

const Post = require('../models/posts')
const User = require('../models/user')

const deleteImage = oldFilePath => {
  const filepath = path.join(__dirname, '..', oldFilePath)
  return fs.unlink(filepath, err => console.error(err))
}

const getFeedController = async (req, res, next) => {
  const page = req.query.page || 1
  const perPage = 3
  let totalItems

  const start = (page - 1) * perPage
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect!',
      errors: errors.array()
    })
  }

  try {
    const postsCount = await Post.find().countDocuments()

    totalItems = postsCount

    const posts = await Post.find().skip(start).limit(perPage)
    return res.json({ message: 'fetching posts', posts: posts, totalItems })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const postCreatePost = async (req, res, next) => {
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
    creator: req.userId
  })
  let creator

  try {
    await post.save()
    const user = await User.findById(req.userId)

    creator = user
    user.posts.push(post)

    await user.save()

    return res.status(201).json({
      message: 'post created',
      post: post,
      creator: { _id: creator._id, name: creator.name }
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const getPostController = async (req, res, next) => {
  const postId = req.params.postId

  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('post was not found!')
      error.statusCode = 404
      throw error
    }
    return res.status(200).json({ message: 'post fetched', post })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const updatePostController = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Post not found!')
      error.statusCode = 404
      throw error
    } else if (post.creator.toString() !== req.userId) {
      const error = new Error('not authorized!')
      error.statusCode = 403
      throw error
    }

    if (imageUrl !== post.imageUrl) {
      deleteImage(post.imageUrl)
    }
    post.title = title
    post.content = content
    post.imageUrl = imageUrl
    const updatedPost = await post.save()

    return res.status(200).json({
      message: 'post updated',
      post: updatedPost
    })
  } catch (err) {
    if (req.file) {
      deleteImage(req.file.path)
    }
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const deletePostController = async (req, res, next) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Post not found!')
      error.statusCode = 404
      throw error
    } else if (post.creator.toString() !== req.userId) {
      const error = new Error('not authorized!')
      error.statusCode = 403
      throw error
    }
    deleteImage(post.imageUrl)
    const deletedPost = await Post.findByIdAndDelete(postId)

    const author = await User.findById(deletedPost.creator)
    author.posts.pull(postId)
    await author.save()
    return res.status(200).json({
      message: 'post deleted',
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}


module.exports = {
  getFeedController,
  postCreatePost,
  getPostController,
  updatePostController,
  deletePostController
}