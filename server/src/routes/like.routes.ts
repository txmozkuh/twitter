import { createLikeController, deleteLikeController } from '@/controllers/like.controllers'
import {
  createBookmarkValidator as createLikeValidator,
  deleteBookmarkValidator as deleteLikeValidator
} from '@/middlewares/bookmark.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const likeRouter = Router()

/**
 * @swagger
 *   /likes:
 *     post:
 *       summary: Like a tweet
 *       description: Allows an authenticated user to like a tweet by its ID.
 *       tags:
 *         - Likes
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
 *                   description: ID of the tweet to like
 *       responses:
 *         '200':
 *           description: Successfully like tweet
 *         '400':
 *           description: Failed to request
 */

likeRouter.post('/', accessTokenValidator, createLikeValidator, validateRequest, createLikeController)

/**
 * @swagger
 *   /likes/tweet/{tweet_id}:
 *     delete:
 *       summary: Unlike a tweet
 *       description: Allows an authenticated user to unlike a tweet by its ID.
 *       tags:
 *         - Likes
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: tweet_id
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the tweet to unlike
 *       responses:
 *         '200':
 *           description: Successfully unlike tweet
 *         '400':
 *           description: Failed to request
 */

likeRouter.delete('/tweet/:tweet_id', accessTokenValidator, deleteLikeValidator, validateRequest, deleteLikeController)

export default likeRouter
