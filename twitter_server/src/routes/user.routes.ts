import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  verifyTokenController
} from '@/controllers/users.controllers'
import {
  loginValidator,
  logoutValidator,
  registerValidator,
  refreshTokenValidator,
  verifyTokenValidator,
  validateRequest
} from '@middlewares/user.middlewares'

const userRouter = Router()

userRouter.post('/login', loginValidator, validateRequest, loginController)
userRouter.post('/register', registerValidator, validateRequest, registerController)
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)
userRouter.post('/refresh-token', refreshTokenValidator, validateRequest, refreshTokenController)
userRouter.post('/verify', verifyTokenValidator, validateRequest, verifyTokenController)
export default userRouter
