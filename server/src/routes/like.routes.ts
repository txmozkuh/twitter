import { createLikeController, deleteLikeController } from '@/controllers/like.controllers'
import {
  createBookmarkValidator as createLikeValidator,
  deleteBookmarkValidator as deleteLikeValidator
} from '@/middlewares/bookmark.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const likeRouter = Router()

likeRouter.post('/', accessTokenValidator, createLikeValidator, validateRequest, createLikeController)
likeRouter.delete('/tweet/:tweet_id', accessTokenValidator, deleteLikeValidator, validateRequest, deleteLikeController)

export default likeRouter
