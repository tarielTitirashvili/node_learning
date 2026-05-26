// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const { mongoConnect } = require('./util/database')
const mongoose = require('mongoose')
// const User = require('./models/user')

// my code
const adminRouter = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')
const rootDir = require('./util/path')


const app = express()
// console.log('process.env.password', process.env)
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))

// app.use((req, res, next) => {
//   User
//     .fetchById('6a135c5b11dbed4fdefd81ca')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart?.items ? user.cart : { items: [] }, user._id)
//       next()
//     })
//     .catch(err => console.error(err))
// })

app.use('/admin', adminRouter)
app.use(shopRoutes)
app.use(notFoundRouter)

mongoose
  .connect('mongodb+srv://tarielTitirashvili:xdGwE0V00yyYVQhK@nodeshopapp.1b9bnle.mongodb.net/shop?appName=nodeShopApp')
  .then(() => {
    app.listen(9000)
  }).catch(err =>console.error(err))