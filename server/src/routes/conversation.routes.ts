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
 *   name: Message
 *   description: Message endpoints
 */

//Lấy danh sách chat với tin nhắn gần nhất
conversationRouter.get('/message', accessTokenValidator, validateRequest, getChatListController)

//Lấy danh sách chat của 2 người
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
