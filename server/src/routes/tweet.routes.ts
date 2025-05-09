import { createTweetController, getTweetController } from '@/controllers/tweets.controllers'
import { createTweetValidator, getTweetDetailValidator } from '@/middlewares/tweet.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const tweetRouter = Router()

tweetRouter.post('/create', accessTokenValidator, createTweetValidator, validateRequest, createTweetController)
tweetRouter.get('/detail/:tweet_id', accessTokenValidator, getTweetDetailValidator, validateRequest, getTweetController)

export default tweetRouter
