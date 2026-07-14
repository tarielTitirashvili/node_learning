const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// const dotenv = require("dotenv");

const signupController = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('validation failed')
    error.statusCode = 422
    error.date = errors.array()
    throw error
  }
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ password: hashedPassword, email, name })
    const savedUser = await user.save()
    res.statusCode = 201
    return res.json({ message: 'user was created!', userData: savedUser._id })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const loginController = async (req, res, next) => {
  const { email, password } = req.body
  let foundUser

  try {
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('User with this email could\'t be found.')
      error.statusCode = 401
      throw error
    }
    foundUser = user
    const isPasswordEqual = await bcrypt.compare(password, user.password)
    if (!isPasswordEqual) {
      const error = new Error('Wrong password!')
      error.statusCode = 401
      throw error
    }
    const token = jwt.sign({
      email: foundUser.email,
      userId: foundUser._id.toString()
    }, process.env.SECRET, { expiresIn: '1h' })

    return res.status(200).json({
      message: 'authenticated',
      token: token,
      userId: foundUser._id.toString()
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const getStatusController = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User with this email could\'t be found.')
      error.statusCode = 401
      throw error
    }
    return res.json({ status: user.status })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const updateStatusController = async (req, res, next) => {
  const newStatus = req.body.status
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      const error = new Error('User with this email could\'t be found.')
      error.statusCode = 401
      throw error
    }

    user.status = newStatus
    await user.save()
    return res.json({ message: "status was updated" })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

module.exports = {
  signupController,
  loginController,
  getStatusController,
  updateStatusController,
}