import {
  createTweetController,
  // getTweetController,
  getTweetListController,
  getTweetChildrenController,
  getNewfeedController,
  getTweetDetailController
} from '@/controllers/tweets.controllers'
import {
  createTweetValidator,
  getTweetDetailValidator,
  getTweetChildrenValidator,
  audienceValidator
} from '@/middlewares/tweet.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const tweetRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Tweets endpoints
 */

//Tạo tweet:
/**
 * @swagger
 * /tweets/create:
 *   post:
 *     summary: Create tweet
 *     tags: [Tweets]
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
tweetRouter.post('/create', accessTokenValidator, createTweetValidator, validateRequest, createTweetController)

// tweetRouter.get(
//   '/detail/:tweet_id',
//   accessTokenValidator,
//   getTweetDetailValidator,
//   audienceValidator,
//   validateRequest,
//   getTweetController
// )

//Lấy danh sách tweet

tweetRouter.get('/', accessTokenValidator, validateRequest, getTweetListController)

//Param: {number, page,tweet_type}
tweetRouter.get(
  '/children/:tweet_id',
  accessTokenValidator,
  getTweetChildrenValidator,
  audienceValidator,
  validateRequest,
  getTweetChildrenController
)

/**
 * @swagger
 * /tweets/newfeed:
 *   get:
 *     summary: Get Newfeed
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful get tweet list
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
tweetRouter.get('/newfeed', accessTokenValidator, validateRequest, getNewfeedController)

tweetRouter.get(
  '/detail/:tweet_id',
  accessTokenValidator,
  getTweetDetailValidator,
  audienceValidator,
  validateRequest,
  getTweetDetailController
)
export default tweetRouter
