const express = require('express')

const authController = require('../controllers/auth')

const authRouter = express.Router()

authRouter.get('/login', authController.getLoginPageController)

authRouter.post('/login', authController.postLoginRequestController)

authRouter.post('/logout', authController.postLogOutRequestController)

authRouter.get('/signup', authController.getSignupPageController)

authRouter.post('/signup', authController.postSignupRequestController)

authRouter.get('/reset-password', authController.getResetPasswordPageController)

authRouter.post('/reset-password', authController.postResetPasswordController)

authRouter.get('/reset-password/:token', authController.getResetPasswordSessionPageController)

authRouter.post('/reset-password/update', authController.postResetPasswordSessionController)

module.exports = authRouter