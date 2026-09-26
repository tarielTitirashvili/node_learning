import express from 'express'
import todosRouter from './Router/todos'
import bodyParser from 'body-parser';

const app = express()

app.use(bodyParser.json());

app.use('/api', todosRouter)

app.listen(3000)