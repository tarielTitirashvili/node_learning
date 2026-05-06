const express = require('express')
const path = require('path')

const homeRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
const rootDir = require('./utils/rootDir')

const app = express()

app.use(express.static(path.join(rootDir, 'public')))

app.use(homeRouter)
app.use('/admin',adminRouter)

app.listen(9000)