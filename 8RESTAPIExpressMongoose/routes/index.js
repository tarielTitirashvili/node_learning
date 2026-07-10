const authRouter = require('./auth')
const feedRouter = require('./feed')
const express = require('express')

const router = express.Router()

router.use('/feed', feedRouter)

router.use('/auth', authRouter)

module.exports = router