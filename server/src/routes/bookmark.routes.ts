import { createBookmarkController, deleteBookmarkController } from '@/controllers/bookmark.controllers'
import { createBookmarkValidator, deleteBookmarkValidator } from '@/middlewares/bookmark.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const bookmarkRouter = Router()

bookmarkRouter.post('/', accessTokenValidator, createBookmarkValidator, validateRequest, createBookmarkController)
bookmarkRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  deleteBookmarkValidator,
  validateRequest,
  deleteBookmarkController
)

export default bookmarkRouter
