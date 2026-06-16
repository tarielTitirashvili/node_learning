// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const { mongoConnect } = require('./util/database')
const mongoose = require('mongoose')
const User = require('./models/user')
const csurf = require('csurf')
const flash = require('connect-flash')
// my code
const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')
const rootDir = require('./util/path')
const authRouter = require('./routes/auth')
const session = require('express-session')
const MongoDBSessionStore = require('connect-mongodb-session')(session)
const multer = require('multer')

const MONGO_URI = 'mongodb+srv://tarielTitirashvili:xdGwE0V00yyYVQhK@nodeshopapp.1b9bnle.mongodb.net/shop?appName=nodeShopApp'

const app = express()
// console.log('process.env.password', process.env)

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


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))

const mongoSessionStore = new MongoDBSessionStore({
  uri: MONGO_URI,
  collection: 'sessions',
})

const csurfProtection = csurf()

app.use(session({ secret: 'Tariel', resave: false, saveUninitialized: false, store: mongoSessionStore }))

app.use(csurfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (req.session.isLoggedIn && req.session.userId) {
    User
      .findById(req.session.userId)
      .then(user => {
        if (!user) {
          return next()
        }
        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        throw new Error('Users Table Error' + err)
      })
  } else {
    next()
  }
})

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn,
    res.locals.csurfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRouter)
app.use(authRouter)
app.use(shopRoutes)
app.use(notFoundRouter)

app.use((error, req, res, next) => {
  // ! if we will call next(error) somewhere in app
  // ! all other middlewares will be skipped and we will be here
  console.log('Tariel\'s Errors', error)
  res.status(500).render('500Error', {
    path: '500Error',
    docTitle: 'Internal Server Error',
    isLoggedIn: req.session.isLoggedIn
  })
})


mongoose
  .connect(MONGO_URI)
  .then(() => {
    // User.find().then(users => {
    //   if (!users?.length) {
    //     const user = new User({
    //       name: 'tariel',
    //       email: 'tariel@gmail.com',
    //       cart: {
    //         items: []
    //       }
    //     })
    //     user.save()
    //   }
    // })
    app.listen(9000)
  }).catch(err => console.error(err))