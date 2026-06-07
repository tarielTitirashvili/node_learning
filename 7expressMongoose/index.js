// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const { mongoConnect } = require('./util/database')
const mongoose = require('mongoose')
const User = require('./models/user')

// my code
const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')
const rootDir = require('./util/path')
const authRouter = require('./routes/auth')
const session = require('express-session')
const MongoDBSessionStore = require('connect-mongodb-session')(session)

const MONGO_URI = 'mongodb+srv://tarielTitirashvili:xdGwE0V00yyYVQhK@nodeshopapp.1b9bnle.mongodb.net/shop?appName=nodeShopApp'

const app = express()
// console.log('process.env.password', process.env)
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
const mongoSessionStore = new MongoDBSessionStore({
  uri: MONGO_URI,
  collection: 'sessions',
})
app.use(session({ secret: 'Tariel', resave: false, saveUninitialized: false, store: mongoSessionStore }))

app.use((req, res, next) => {
  if (req.session.isLoggedIn && req.session.userId) {
    User
      .findById(req.session.userId)
      .then(user => {
        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next()
      })
  } else {
    next()
  }
})

app.use('/admin', adminRouter)
app.use(authRouter)
app.use(shopRoutes)
app.use(notFoundRouter)


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