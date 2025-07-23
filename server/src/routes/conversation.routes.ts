import {
  sendMessageController,
  getChatListController,
  getChatDetailController
} from '@/controllers/conversation.controllers'
import { getConversationDetailValidator } from '@/middlewares/conversation.middlewares'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'

const conversationRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Message endpoints
 */

//Lấy danh sách chat với tin nhắn gần nhất

conversationRouter.get('/message', accessTokenValidator, validateRequest, getChatListController)

//Lấy danh sách chat của 2 người
/**
 * @swagger
 * /conversations/message/detail/{user_id}:
 *   get:
 *     summary: Get conversation history
 *     tags: [Conversation]
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

//Gửi tin nhắn,lưu vào db
conversationRouter.post('/send-message', accessTokenValidator, validateRequest, sendMessageController)

export default conversationRouter
