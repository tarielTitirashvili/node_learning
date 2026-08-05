const User = require('../models/user')
const Post = require('../models/posts')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const deleteImage = require('../helpers/deleteFiles')

module.exports = {
  createUser: async function (args, req) {
    const email = args.userInput.email
    const name = args.userInput.name
    const password = args.userInput.password

    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Invalid email' })
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 3 })) {
      errors.push({ message: 'Not Valid Password' })
    }
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 3 })) {
      errors.push({ message: 'not valid name' })
    }

    if (errors.length) {
      const error = new Error("Invalid input")
      error.data = errors
      error.code = 411
      throw error
    }

    const user = await User.findOne({ email })
    if (user) {
      const error = new Error('User Already Exists')
      throw error
    }
    const hashedPW = await bcrypt.hash(password, 12)

    const newUser = new User({
      email,
      name,
      password: hashedPW
    })
    const createdUser = await newUser.save()
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    }
  },
  login: async function (args, req) {
    const email = args.email
    const password = args.password

    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('User not found')
      error.code = 401
      throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('not authenticated')
      error.code = 401
      throw error
    }
    const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, process.env.SECRET, { expiresIn: '1h' })
    return {
      token,
      userId: user._id.toString()
    }
  },
  createPost: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }

    const { title, imageUrl, content } = args.userInput

    const errors = []

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ message: 'Invalid title' })
    }
    if (validator.isEmpty(imageUrl)) {
      errors.push({ message: 'Invalid imageUrl' })
    }
    if (validator.isEmpty(content) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Invalid title' })
    }

    if (errors.length) {
      const error = new Error("Invalid input")
      error.data = errors
      error.code = 411
      throw error
    }
    const creatorUser = await User.findById(req.userId)
    if (!creatorUser) {
      const error = new Error("User Not Found")
      error.data = errors
      error.code = 411
      throw error
    }

    const newPost = new Post({
      title,
      imageUrl,
      content,
      creator: creatorUser
    })
    const createdPost = await newPost.save()

    creatorUser.posts.push(createdPost)
    await creatorUser.save()
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString()
    }
  },
  posts: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }
    const page = args.page || 1
    const perPage = 3
    const totalPostsCount = await Post.find().countDocuments()
    const posts = await Post.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).populate('creator')

    return {
      posts: posts.map(p => ({
        ...p._doc,
        _id: p._id.toString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      totalPosts: totalPostsCount
    }
  },
  post: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id).populate('creator')

    if (!post) {
      const error = new Error('Post Not Found!')
      error.code = 404
      throw error
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  },
  updatePost: async function ({ id, userInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }

    const { title, imageUrl, content } = userInput

    const errors = []

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ message: 'Invalid title' })
    }
    if (validator.isEmpty(imageUrl)) {
      errors.push({ message: 'Invalid imageUrl' })
    }
    if (validator.isEmpty(content) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Invalid title' })
    }

    if (errors.length) {
      const error = new Error("Invalid input")
      error.data = errors
      error.code = 411
      throw error
    }

    const post = await Post.findById(id).populate('creator')
    if (!post) {
      const error = new Error('post not found!')
      error.code = 401
      throw error
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('No Permission for edit!')
      error.code = 403
      throw error
    }
    post.title = title
    post.content = content

    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl
    }
    const updatedPost = await post.save()

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    }
  },
  deletePost: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }
    const targetPost = await Post.findById(id)
    if (targetPost.creator.toString() !== req.userId) {
      const error = new Error('No Permission for edit!')
      error.code = 403
      throw error
    }
    if (targetPost.imageUrl) {
      deleteImage(targetPost.imageUrl)
    }
    await Post.findByIdAndDelete(id)

    const creator = await User.findById(req.userId).populate('posts')
    creator.posts.pull(id)
    await creator.save()

    return true
  },
  user: async function (_, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User Not Found!')
      error.code = 401
      throw error
    }
    return {
      ...user._doc,
      _id: user._id.toString(),
    }
  },
  updateStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated!')
      error.code = 401
      throw error
    }
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User Not Found!')
      error.code = 401
      throw error
    }
    if (validator.isEmpty(status) || !validator.isLength(status, { min: 5 })) {
      errors.push({ message: 'Invalid Status' })
    }
    user.status = status
    const updatedUser = await user.save()
    return {
      ...updatedUser._doc,
      _id: (await updatedUser)._id.toString(),
    }
  }
}