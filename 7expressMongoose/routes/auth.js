const express = require('express')
const { check, body } = require('express-validator')
const User = require('../models/user')

const authController = require('../controllers/auth')

const authRouter = express.Router()

authRouter.get('/login', authController.getLoginPageController)

authRouter.post(
  '/login',
  [
    check('email')
      .isEmail()
      .normalizeEmail()
      .custom(
        (value, { req }) => {
          return User.findOne({ email: value })
            .then(user => {
              if (!user) {
                return Promise.reject('Not Valid email or Password tariel')
              }
              req.session.loginIdentifiedUserId = user._id.toString()
              req.session.loginIdentifiedUserPassword = user.password
              return true
            })
        }
      ),
    body('password')
      .trim()
      .isLength({
        min: 6,
      })
      .isAlphanumeric()
      .withMessage('enter valid password!')
  ],
  authController.postLoginRequestController
)

authRouter.post('/logout', authController.postLogOutRequestController)

authRouter.get('/signup', authController.getSignupPageController)

authRouter.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('enter valid email!')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('E-Mail exists already, pick other one!')
            }
          })
      })
    ,
    body('password', 'password should be from 6 to 32 characters in length.')
      .trim()
      .isLength({
        min: 6,
        max: 32
      })
      .isAlphanumeric(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw Error('tariel\'s error not not equal password and confirm password!')
        }
        return true
      })
  ]
  ,
  authController.postSignupRequestController
)

authRouter.get('/reset-password', authController.getResetPasswordPageController)

authRouter.post('/reset-password', authController.postResetPasswordController)

authRouter.get('/reset-password/:token', authController.getResetPasswordSessionPageController)

authRouter.post('/reset-password/update', authController.postResetPasswordSessionController)

module.exports = authRouter