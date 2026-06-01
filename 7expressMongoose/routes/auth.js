const express = require('express')

const authController = require('../controllers/auth')

const authRouter = express.Router()

authRouter.get('/login', authController.getLoginPageController)

authRouter.post('/login', authController.postLoginRequestController)

authRouter.post('/logout', authController.postLogOutRequestController)

module.exports = authRouter