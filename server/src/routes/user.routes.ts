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
 *     summary: Login
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
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Gia Mỹ
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: giamy@gmail.com
 *                     date_of_birth:
 *                       type: string
 *                       format: date-time
 *                       example: "2000-12-18T00:00:00.000Z"
 *                     bio:
 *                       type: string
 *                       example: ""
 *                     location:
 *                       type: string
 *                       example: Vietnam
 *                     website:
 *                       type: string
 *                       example: ""
 *                     username:
 *                       type: string
 *                       example: giamyne
 *                     avatar:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/.../avatar.avif
 *                     cover_photo:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/.../cover.avif
 *                     access_token:
 *                       type: string
 *                       example: Bearer ey...
 *                     refresh_token:
 *                       type: string
 *                       example: Bearer ey...
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: us
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: register
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: logout
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
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
