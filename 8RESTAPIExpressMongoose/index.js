const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const dotenv = require("dotenv")
const router = require('./routes')
dotenv.config()

const app = express()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true) //! second param allows to store file
  } else {
    cb(null, false)
  }
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  },
})

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))


// const ALLOWED_ORIGINS = [
//   'https://codepen.io',
//   'https://cdpn.io',
// ]

app.use((req, res, next) => {
  // const origin = req.headers.origin

  // if (ALLOWED_ORIGINS.includes(origin)) {
  //   res.setHeader('Access-Control-Allow-Origin', origin)
  // }
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(router)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(statusCode).json({ message: message, data: data })
})

mongoose.connect(process.env.DB_URI).then(dbResult => {
  const server = app.listen(9000)
  const io = require('./socket').init(server, {
    cors: {
      origin: "http://localhost:3000", // your React app
      // methods: ["GET", "POST", ],
      credentials: true,
    },
  })
  io.on('connection', socket => {
    console.log('Socket connected.')
  })
}).catch(err => console.error('tariel', err))