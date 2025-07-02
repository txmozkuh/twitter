import 'express-async-errors'
import express, { NextFunction } from 'express'
import cors from 'cors'
import { errorHandler } from '@/middlewares/errorHandler'
import { env } from './config/env'
import { getPublicId, initFolder } from '@/utils/file'
import './config/passport'
import databaseService from '@/services/database.services'
import userRouter from '@routes/user.routes'
import tweetRouter from '@/routes/tweet.routes'
import mediaRouter from '@/routes/media.routes'
import bookmarkRouter from '@/routes/bookmark.routes'
import likeRouter from './routes/like.routes'
import passport from 'passport'
import conversationRouter from './routes/conversation.routes'
import { serverSocket } from './config/socket'
import http from 'http'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
initFolder()

databaseService
  .connect()
  .then(() => {
    console.log('⚙️  DATABASE CONNECTED ⚙️')
  })
  .catch((err) => console.log('Fail to connect database', err))

const app = express()
const PORT = env.PORT || 3000

app.use(cors())
app.use(helmet())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter)
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:4000', //allow testing client
    credentials: true
  })
)

app.use(passport.initialize())
app.use('/users', userRouter)
app.use('/tweets', tweetRouter)
app.use('/medias', mediaRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/conversations', conversationRouter)

app.use(errorHandler)

const httpServer = http.createServer(app)
serverSocket(httpServer)
httpServer.listen(PORT, () => {
  console.log(`⚙️  Server is running at port: ${PORT} \n ---------------------------------`)
})
