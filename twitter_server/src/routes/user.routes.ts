import { Router } from 'express'
import { registerController, loginController, logoutController } from '@/controllers/users.controllers'
import { loginValidator, logoutValidator, registerValidator, validateRequest } from '@middlewares/user.middlewares'
const userRouter = Router()
import databaseService from '@/services/database.services'

// userRouter.get('/', async (req, res) => {
//   const userCollection = await databaseService.getCollection('users')
//   const users = (await userCollection.find().toArray()).map((user) => ({
//     name: user.name,
//     email: user.email,
//     password: user.password
//   }))
//   res.status(200).json(users)
// })
userRouter.post('/login', loginValidator, validateRequest, loginController)
userRouter.post('/register', registerValidator, validateRequest, registerController)
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)

export default userRouter
