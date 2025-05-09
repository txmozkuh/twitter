import express from 'express'
import userRouter from '@routes/user.routes'
import databaseService from '@/services/database.services'
import { errorHandler } from '@/middlewares/errorHandler'
import cors from 'cors'
import 'express-async-errors'
import tweetRouter from '@/routes/tweet.routes'
import mediaRouter from '@/routes/media.routes'
import { getPublicId, initFolder } from '@/utils/file'
import { sendVerifyEmail } from '@/utils/email'
import bookmarkRouter from '@/routes/bookmark.routes'

initFolder()

databaseService
  .connect()
  .then(() => {
    console.log('⚙️  DATABASE CONNECTED ⚙️')
  })
  .catch((err) => console.log('Fail to connect database', err))

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:4000', //allow testing client
    credentials: true
  })
)

app.use('/users', userRouter)
app.use('/tweets', tweetRouter)
app.use('/medias', mediaRouter)
app.use('/bookmarks', bookmarkRouter)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`⚙️  Server is running at port: ${PORT} \n ---------------------------------`)
})
