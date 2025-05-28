import { Request, Response, Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  verifyTokenController,
  forgotPasswordController,
  resetPasswordController,
  updateProfileController,
  getProfileController,
  updateAvatarController,
  updateCoverPhotoController,
  deleteCoverPhotoController,
  followUserController,
  unFollowUserController,
  googleAuthController
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
  updateProfileValidator,
  followUserValidator,
  unFollowUserValidator
} from '@middlewares/user.middlewares'
import passport from 'passport'
import { env } from '@/config/env'

const userRouter = Router()

userRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)
userRouter.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthController)

userRouter.post('/login', loginValidator, validateRequest, loginController)
userRouter.post('/register', registerValidator, validateRequest, registerController)
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)
userRouter.post('/refresh-token', refreshTokenValidator, validateRequest, refreshTokenController)
userRouter.post('/verify-email', verifyTokenValidator, validateRequest, verifyTokenController)
userRouter.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPasswordController)
userRouter.post('/reset-password', resetPasswordValidator, validateRequest, resetPasswordController)

userRouter.get('/profile', accessTokenValidator, validateRequest, getProfileController)
userRouter.patch('/update', accessTokenValidator, updateProfileValidator, validateRequest, updateProfileController)
userRouter.post('/update-avatar', accessTokenValidator, validateRequest, updateAvatarController)
userRouter.post('/update-cover', accessTokenValidator, validateRequest, updateCoverPhotoController)
userRouter.patch('/delete-cover-photo', accessTokenValidator, validateRequest, deleteCoverPhotoController)

userRouter.post('/follow', accessTokenValidator, followUserValidator, validateRequest, followUserController)
userRouter.delete('/unfollow', accessTokenValidator, unFollowUserValidator, validateRequest, unFollowUserController)

export default userRouter
