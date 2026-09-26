import express from 'express'
import todosRouter from './Router/todos'

const app = express()


app.use('/api', todosRouter)

app.listen(3000)