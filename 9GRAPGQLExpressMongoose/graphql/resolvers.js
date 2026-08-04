const User = require('../models/user')
const Post = require('../models/posts')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

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
  }
}