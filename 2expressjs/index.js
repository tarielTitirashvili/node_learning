// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
// my code
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use('/admin',adminRoutes)
app.use(shopRoutes)
app.use(notFoundRouter)

app.listen(9000)
