const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const dotenv = require("dotenv")
const { graphqlHTTP } = require('express-graphql')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const authMiddleware = require('./middleware/auth')
const fs = require('fs')

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
  if(req.method === "OPTIONS"){
    return res.sendStatus(200)
  } 
  next()
})

app.use(authMiddleware.isAuth)

app.put('/post-image', (req, res, next)=>{
  if(!req.isAuth){
    const error = new Error('Not authenticated!')
    error.code = 401
    throw error
  }
  if(!req.file){
    return res.status(200).json({message: "No file provided!"})
  }
  if(req.body.oldPath){
    deleteImage(req.body.oldPath)
  }

  return res.status(201).json({message:'File was stored!', filePath: req.file.path})
})

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
  formatError: (error) => {
    if (!error.originalError) {
      return error
    }
    const data = error.originalError.data
    const message = error.message || 'an error occurred'
    const code = error.originalError.code || 500
    return {
      message,
      status: code,
      data: data
    }
  }
}))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(statusCode).json({ message: message, data: data })
})

mongoose.connect(process.env.DB_URI).then(dbResult => {
  app.listen(9000)
}).catch(err => console.error('tariel', err))


const deleteImage = oldFilePath => {
  const filepath = path.join(__dirname, '..', oldFilePath)
  return fs.unlink(filepath, err => console.error(err))
}