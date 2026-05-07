// 3rd party
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// my code
const {adminRouter} = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const notFoundRouter = require('./routes/notFound')
const rootDir = require('./util/path')

const app = express()

app.use(express.static(path.join(rootDir, 'public')))
app.use(bodyParser.urlencoded({extended: false}))

app.use('/admin', adminRouter)
app.use(shopRoutes)
app.use(notFoundRouter)

app.listen(9000)
