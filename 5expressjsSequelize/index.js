// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

// my code
const { adminRouter } = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')
const rootDir = require('./util/path')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(rootDir, 'public')))
app.use((req, res, next) => {
  User
    .findByPk(1)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.error(err))
})

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin', adminRouter)
app.use(shopRoutes)
app.use(notFoundRouter)

app.listen(9000)

Product.belongsTo(User, { constraint: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})

sequelize.sync({ force: true }).then(res => {
  return User.findByPk(1)
})
  .then((user) => {
    console.log('NEW TARIEL')
    if (!user) {
      return User.create({ name: 'Tariel', lastName: 'titirashvili', email: 'tariel@gmail.com' }).catch(err => console.log('error', err))
    }
    console.log('tariel', user)
    return user
  }).then((user) => {
    console.log('New TARIEL', user)
  })
  .catch((err) => {
    // console.error('sync Error',err)
  })
