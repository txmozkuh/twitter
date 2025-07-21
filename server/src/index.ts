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
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
initFolder()

databaseService
  .connect()
  .then(() => {
    console.log('⚙️  DATABASE CONNECTED ⚙️')
  })
  .catch((err) => console.log('Fail to connect database', err))

const app = express()
const PORT = env.PORT || 3000

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
    origin: env.CLIENT_URL,
    credentials: true
  })
)
console.log('Showing connection to: ', env.CLIENT_URL)
// app.use(cors())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Node + TypeScript + Swagger example'
    },

    tags: [
      { name: 'Users', description: 'Auth-related endpoint' },
      { name: 'Tweets', description: 'Tweet endpoint' },
      { name: 'Likes', description: 'Like endpoint' },
      { name: 'Bookmarks', description: 'Bookmark endpoint' },
      { name: 'Messages', description: 'Message endpoint' },
      { name: 'Medias', description: 'Images & Videos endpoint' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ['./src/routes/*.ts']
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .curl-command, .request-url, .request-headers {
        display: none !important;
      }
    `
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
