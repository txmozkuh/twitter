import { createLikeController, deleteLikeController } from '@/controllers/like.controllers'
import { createLikeValidator } from '@/middlewares/like.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const likeRouter = Router()

likeRouter.post('/', accessTokenValidator, createLikeValidator, validateRequest, createLikeController)
likeRouter.delete('/tweet/:tweet_id', accessTokenValidator, validateRequest, deleteLikeController)

export default likeRouter
