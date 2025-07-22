import { NextFunction, Request, Response, Router } from 'express'
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
import { sendVerifyEmail } from '@/utils/email'

const userRouter = Router()

userRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)
userRouter.post('/send-email', (req: Request, res: Response, next: NextFunction) => {
  next()
})

userRouter.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthController)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login in app
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 example: Example123.
 *     responses:
 *       200:
 *         description: Successfully login
 *       400:
 *         description: Incorrect login parameters
 */
userRouter.post('/login', loginValidator, validateRequest, loginController)
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *               - confirm_password
 *               - date_of_birth
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               name :
 *                 type: string
 *                 example: exampleee
 *               password :
 *                 type: string
 *                 example: Example123.
 *               confirm_password :
 *                 type: string
 *                 example: Example123.
 *               date_of_birth :
 *                 type : string
 *                 example: 2025-03-20T03:11:52.126Z
 *     responses:
 *       200:
 *         description: Successfully register
 *       400:
 *         description: Incorrect register parameters
 *
 */
userRouter.post('/register', registerValidator, validateRequest, registerController)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *               - date_of_birth
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logout
 *       400:
 *         description: Failed to logout (expired token)
 *     security:
 *        - bearerAuth: []
 *
 */
userRouter.post('/logout', logoutValidator, validateRequest, logoutController)

userRouter.post('/refresh-token', refreshTokenValidator, validateRequest, refreshTokenController)
userRouter.get('/verify-email', verifyTokenValidator, validateRequest, verifyTokenController)
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
