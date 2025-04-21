import { createTweetController } from '@/controllers/tweets.controllers'
import { errorHandler } from '@/middlewares/errorHandler'
import { createTweetValidator } from '@/middlewares/tweet.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidator, createTweetValidator, validateRequest, createTweetController)

export default tweetRouter
