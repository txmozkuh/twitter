import { createBookmarkController, deleteBookmarkController } from '@/controllers/bookmark.controllers'
import { createBookmarkValidator, deleteBookmarkValidator } from '@/middlewares/bookmark.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const bookmarkRouter = Router()

/**
 * @swagger
 *   /bookmarks:
 *     post:
 *       summary: Bookmark a tweet
 *       description: Allows an authenticated user to bookmark a tweet by its ID.
 *       tags:
 *         - Bookmarks
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - tweet_id
 *               properties:
 *                 tweet_id:
 *                   type: string
 *                   description: ID of the tweet to bookmark
 *       responses:
 *         '200':
 *           description: Successfully bookmark a tweet
 *         '400':
 *           description: Failed to request
 */

bookmarkRouter.post('/', accessTokenValidator, createBookmarkValidator, validateRequest, createBookmarkController)

/**
 * @swagger
 *   /bookmarks/tweet/{tweet_id}:
 *     delete:
 *       summary: Unbookmark a tweet
 *       description: Allows an authenticated user to unbookmark a tweet by its ID.
 *       tags:
 *         - Bookmarks
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: tweet_id
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the tweet to unbookmark
 *       responses:
 *         '200':
 *           description: Successfully unbookmark tweet
 *         '400':
 *           description: Failed to request
 */

bookmarkRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  deleteBookmarkValidator,
  validateRequest,
  deleteBookmarkController
)

export default bookmarkRouter
