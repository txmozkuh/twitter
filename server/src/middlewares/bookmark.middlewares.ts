import { env } from '@/config/env'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import WrappedError from '@/utils/error'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

export const createBookmarkValidator = checkSchema({
  tweet_id: {
    in: 'body',
    exists: { errorMessage: 'Không tìm thấy tweet id' },
    isString: { errorMessage: 'Tweet id phải là chuỗi' },
    custom: {
      options: async (value: string) => {
        if (!ObjectId.isValid(value))
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id sai định dạng') }

        const cll = await databaseService.getCollection(env.TWEETS_COLLECTION || 'tweets')

        const result = await cll.findOne({ _id: new ObjectId(value) })

        if (!result) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id không tồn tại') }
        }

        return true
      }
    }
  }
})

export const deleteBookmarkValidator = checkSchema({
  tweet_id: {
    in: 'params',
    custom: {
      options: async (value: string) => {
        if (!ObjectId.isValid(value))
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id sai định dạng') }
        const result = await (
          await databaseService.getCollection(env.TWEETS_COLLECTION)
        ).findOne({ _id: new ObjectId(value) })
        if (!result) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id không tồn tại') }
        }
        return true
      }
    }
  }
})
