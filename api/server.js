import express from 'express'
import expressAsyncErrors from 'express-async-errors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

import * as Firebase from './config/firebase.js'
import Router from './routes/index.js'
import { NotFoundMiddleware, ErrorHandlerMiddleware } from './middlewares/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

if (process.env.ENVIRONMENT.toLowerCase() === 'dev')
  app.use(morgan('dev'))

app.use(cors())
app.use(express.json({ limit: '15mb' }))

app.use('/api/v1/', Router)

app.use(NotFoundMiddleware)
app.use(ErrorHandlerMiddleware)

const StartServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  } catch (error) { console.log(`Error: ${error}`) }
}

StartServer()