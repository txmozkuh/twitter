import { createTweetController } from '@/controllers/tweets.controllers'
import { createTweetValidator } from '@/middlewares/tweet.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const tweetRouter = Router()

tweetRouter.post('/create', accessTokenValidator, createTweetValidator, validateRequest, createTweetController)

export default tweetRouter
