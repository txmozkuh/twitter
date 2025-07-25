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

//Tạo tweet:
/**
 * @swagger
 *   /tweets/create:
 *     post:
 *       summary: Create a tweet
 *       description: Allows an authenticated user to create a tweet, retweet, comment, or quote tweet.
 *       tags:
 *         - Tweets
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - type
 *                 - audience
 *                 - content
 *                 - parent_id
 *                 - hashtags
 *                 - mentions
 *                 - medias
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [Tweet, Retweet, comment, quote tweet]
 *                   description: Type of tweet
 *                 audience:
 *                   type: string
 *                   enum: [EveryOne, TweetCircle]
 *                   description: Target audience for the tweet
 *                 content:
 *                   type: string
 *                   description: Content of the tweet
 *                 parent_id:
 *                   type: string
 *                   nullable: true
 *                   description: Parent tweet ID if this is a comment, retweet, or quote
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of hashtags
 *                 mentions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of mentioned usernames
 *                 medias:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of media IDs
 *       responses:
 *         '200':
 *           description: Successfully create a tweet
 *         '400':
 *           description: Failed to request
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

// tweetRouter.get('/', accessTokenValidator, validateRequest, getTweetListController)

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
 *         description: Successful get newfeed
 */
tweetRouter.get('/newfeed', accessTokenValidator, validateRequest, getNewfeedController)

/**
 * @swagger
 *   /tweets/detail/{tweet_id}:
 *     get:
 *       summary: Request for tweet detail, including comments
 *       description: Retrieve tweet details with associated comments by tweet ID.
 *       tags:
 *         - Tweets
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: tweet_id
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the tweet to retrieve
 *       responses:
 *         '200':
 *           description: Successfully get tweet detail
 *         '400':
 *           description: Failed to request
 */

tweetRouter.get(
  '/detail/:tweet_id',
  accessTokenValidator,
  getTweetDetailValidator,
  audienceValidator,
  validateRequest,
  getTweetDetailController
)
export default tweetRouter
