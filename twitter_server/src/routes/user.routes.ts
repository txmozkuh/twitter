import { Router } from 'express'
import { registerController, loginController, logoutController } from '@/controllers/users.controllers'
import { loginValidator, logoutValidator, registerValidator, validateRequest } from '@middlewares/user.middlewares'
const userRouter = Router()

userRouter.post('/login', loginValidator, validateRequest, loginController)
userRouter.post('/register', registerValidator, validateRequest, registerController)
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)

export default userRouter
