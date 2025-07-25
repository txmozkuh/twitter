import {
  sendMessageController,
  getChatListController,
  getChatDetailController
} from '@/controllers/conversation.controllers'
import { getConversationDetailValidator } from '@/middlewares/conversation.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const conversationRouter = Router()

conversationRouter.get('/message', accessTokenValidator, validateRequest, getChatListController)

//Lấy danh sách chat của 2 người
/**
 * @swagger
 * /conversations/message/detail/{user_id}:
 *   get:
 *     summary: Get conversation history
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth : []
 *     parameters:
 *       - name: user_id
 *         in : path
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: OK, sent email for password reclaim
 *       401:
 *         description: Fail to request reclaim password
 *
 */
conversationRouter.get(
  '/message/detail/:user_id',
  accessTokenValidator,
  getConversationDetailValidator,
  validateRequest,
  getChatDetailController
)

/**
 * @swagger
 *   /conversations/send-message:
 *     post:
 *       summary: Store a message into DB
 *       description: Stores a message in the database from one user to another.
 *       tags:
 *         - Conversations
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - from
 *                 - to
 *                 - content
 *               properties:
 *                 from:
 *                   type: string
 *                   description: Sender user ID
 *                 to:
 *                   type: string
 *                   description: Receiver user ID
 *                 content:
 *                   type: string
 *                   description: Message content
 *       responses:
 *         '200':
 *           description: Successfully storing a message
 *         '400':
 *           description: Failed to request
 */

//Gửi tin nhắn,lưu vào db
conversationRouter.post('/send-message', accessTokenValidator, validateRequest, sendMessageController)

export default conversationRouter
