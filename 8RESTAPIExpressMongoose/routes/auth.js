const express = require('express')
const { body } = require('express-validator')
const User = require('../models/user')
const { signupController, loginController, getStatusController, updateStatusController } = require('../controllers/auth')
const { isAuth } = require('../middleware/is-auth')

const authRouter = express.Router()

authRouter.put('/signup', [
  body('email')
    .trim()
    .isEmail()
    .withMessage('enter valid email!')
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email already in use.')
          }
        })
    })
  ,
  body('password')
    .trim()
    .isLength(5),
  body('name')
    .notEmpty(),
], signupController)

authRouter.get('/status', isAuth, getStatusController)

authRouter.put('/status', [body('status').trim().notEmpty()], isAuth, updateStatusController)

authRouter.post('/login', loginController)

module.exports = authRouter