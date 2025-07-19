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
