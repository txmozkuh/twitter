import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  verifyTokenController,
  forgotPasswordController,
  resetPasswordController,
  updateProfileController,
  getProfileController
} from '@/controllers/users.controllers'
import {
  loginValidator,
  logoutValidator,
  registerValidator,
  refreshTokenValidator,
  verifyTokenValidator,
  validateRequest,
  forgotPasswordValidator,
  resetPasswordValidator,
  accessTokenValidator,
  updateProfileValidator
} from '@middlewares/user.middlewares'

const userRouter = Router()

userRouter.post('/login', loginValidator, validateRequest, loginController)
userRouter.post('/register', registerValidator, validateRequest, registerController)
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)
userRouter.post('/refresh-token', refreshTokenValidator, validateRequest, refreshTokenController)
userRouter.post('/verify-email', verifyTokenValidator, validateRequest, verifyTokenController)
userRouter.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPasswordController)
userRouter.post('/reset-password', resetPasswordValidator, validateRequest, resetPasswordController)

userRouter.get('/profile', accessTokenValidator, validateRequest, getProfileController)
userRouter.patch('/update', accessTokenValidator, updateProfileValidator, validateRequest, updateProfileController)

export default userRouter
