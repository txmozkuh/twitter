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
  googleAuthController,
  forgotPasswordTokenController
} from '@/controllers/users.controllers'
import {
  loginValidator,
  logoutValidator,
  registerValidator,
  refreshTokenValidator,
  verifyTokenValidator,
  forgotPasswordTokenValidator,
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

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh new access token in JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully refresh token
 *       401:
 *         description: Fail to verify token
 *
 */
userRouter.post('/refresh-token', refreshTokenValidator, validateRequest, refreshTokenController)

/**
 * @swagger
 * /users/verify-email:
 *   get:
 *     summary: Verify email for real users
 *     tags: [Users]
 *     parameters:
 *     - name : email_verify_token
 *       in : query
 *       required : true
 *       schema :
 *         type : string
 *       description: Token to verify email tagged in url in email
 *     responses:
 *       200:
 *         description: OK, redirect to login page
 *       401:
 *         description: Fail to verify email
 *
 */
userRouter.get('/verify-email', verifyTokenValidator, validateRequest, verifyTokenController)

//Reset password flow : send request reset with email => send email reset with link including token => click link return to ui with token
// => change password with token, old pass, new pass, confirm new pass

//Gửi email kèm link
/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request for new password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK, sent email for password reclaim
 *       401:
 *         description: Fail to request reclaim password
 *
 */
userRouter.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPasswordController)

//
userRouter.get('/forgot-password', forgotPasswordTokenValidator, validateRequest, forgotPasswordTokenController)

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Request for new password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_password
 *               - confirm_new_password
 *               - forgot_password_token
 *             properties:
 *               new_password:
 *                 type: string
 *               confirm_new_password:
 *                 type: string
 *               forgot_password_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully change password, redirect to login page
 *       401:
 *         description: Fail to request reclaim password
 *
 */
userRouter.post('/reset-password', resetPasswordValidator, validateRequest, resetPasswordController)

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get profile infomation
 *     tags: [Users]
 *     security:
 *        - bearerAuth : []
 *     responses:
 *       200:
 *         description: Successfully get profile
 *       401:
 *         description: Fail to get profile
 *
 */
userRouter.get('/profile', accessTokenValidator, validateRequest, getProfileController)

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - bio
 *               - location
 *               - website
 *               - date_of_birth
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully update profile
 *       401:
 *         description: Fail to update profile
 *
 */
userRouter.patch('/update', accessTokenValidator, updateProfileValidator, validateRequest, updateProfileController)

/**
 * @swagger
 * /users/update-avatar:
 *   post:
 *     summary: Request for new password
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully update avatar
 *       401:
 *         description: Fail to update avatar
 *
 */
userRouter.post('/update-avatar', accessTokenValidator, validateRequest, updateAvatarController)

/**
 * @swagger
 * /users/update-cover:
 *   post:
 *     summary: Update cover photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully update cover phote
 *       401:
 *         description: Fail to update cover photo
 *
 */
userRouter.post('/update-cover', accessTokenValidator, validateRequest, updateCoverPhotoController)

/**
 * @swagger
 * /users/delete-cover-photo:
 *   patch:
 *     summary: Delete cover photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     responses:
 *       200:
 *         description: Successfully delete cover phote
 *       401:
 *         description: Fail to delete cover photo
 *
 */
userRouter.patch('/delete-cover-photo', accessTokenValidator, validateRequest, deleteCoverPhotoController)

/**
 * @swagger
 * /users/follow:
 *   post:
 *     summary: Follow a user by user id
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - follow_user_id
 *             properties:
 *               follow_user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully follow user
 *       401:
 *         description: Fail to follow
 *
 */
userRouter.post('/follow', accessTokenValidator, followUserValidator, validateRequest, followUserController)

/**
 * @swagger
 * /users/unfollow:
 *   delete:
 *     summary: Unfollow a user by user id
 *     tags: [Users]
 *     security:
 *       - bearerAuth : []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unfollow_user_id
 *             properties:
 *               unfollow_user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully unfollow user
 *       401:
 *         description: Fail to unfollow
 *
 */
userRouter.delete('/unfollow', accessTokenValidator, unFollowUserValidator, validateRequest, unFollowUserController)

export default userRouter
