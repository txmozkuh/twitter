import express from 'express'
import userRouter from '@routes/user.routes'
import databaseService from '@/services/database.services'
import { errorHandler } from '@/middlewares/errorHandler'
import 'express-async-errors'

databaseService
  .connect()
  .then(() => {
    console.log('⚙️  DATABASE CONNECTED ⚙️')
  })
  .catch((err) => console.log('Fail to connect database', err))

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use('/users', userRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`⚙️  Server is running at port: ${PORT} \n ---------------------------------`)
})
