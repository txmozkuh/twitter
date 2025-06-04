import { env } from '@/config/env'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import { CustomRequest } from '@/types/request'
import WrappedError from '@/utils/error'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

export const getConversationDetailValidator = checkSchema({
  user_id: {
    in: 'params',
    exists: true,
    custom: {
      options: async (user_id: string, { req }) => {
        if (!ObjectId.isValid(user_id)) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Id không hợp lệ') }
        }
        const user = await (
          await databaseService.getCollection(env.USERS_COLLECTION)
        ).findOne({ _id: new ObjectId(user_id) })
        if (!user || user_id === req.user_id) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Không tìm thấy người dùng') }
        }
        return true
      }
    }
  }
})
