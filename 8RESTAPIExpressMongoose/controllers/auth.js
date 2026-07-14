const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// const dotenv = require("dotenv");

const signupController = (req, res, next) => {
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
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ password: hashedPassword, email, name })
      return user.save()
    })
    .then(savingResult => {
      res.statusCode = 201
      res.json({ message: 'user was created!', data: savingResult, userData: savingResult._id })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const loginController = (req, res, next) => {
  const { email, password } = req.body
  let foundUser

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('User with this email could\'t be found.')
        error.statusCode = 401
        throw error
      }
      foundUser = user
      return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!')
        error.statusCode = 401
        throw error
      }

      const token = jwt.sign({
        email: foundUser.email,
        userId: foundUser._id.toString()
      }, process.env.SECRET, { expiresIn: '1h' })

      res.status(200).json({
        message: 'authenticated',
        token: token,
        userId: foundUser._id.toString()
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
  signupController,
  loginController
}