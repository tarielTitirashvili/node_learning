const feedRouter = require('./feed')
const express = require('express')

const router = express.Router()

router.use('/feed', feedRouter)


module.exports = router