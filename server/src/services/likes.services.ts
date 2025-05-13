import { env } from '@/config/env'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import Like from '@/models/schemas/like.schema'
import databaseService from '@/services/database.services'
import { SuccessData } from '@/types/response'
import WrappedError from '@/utils/error'
import { ObjectId } from 'mongodb'

class LikeService {
  async createLike(tweet_id: ObjectId, user_id: ObjectId) {
    const cll = await databaseService.getCollection(env.LIKES_COLLECTION || 'bookmarks')
    const like = await cll.findOne({ tweet_id })

    if (like) {
      throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet này đã được like')
    } else {
      await cll.insertOne(new Like({ tweet_id, user_id }))
      return 'Like tweet thành công'
    }
  }

  async deleteLike(tweet_id: ObjectId) {
    const cll = await databaseService.getCollection(env.LIKES_COLLECTION || 'likes')
    const like = await cll.findOne({ tweet_id })
    if (!like) throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet này chưa được like')
    else {
      await cll.deleteOne({ _id: like._id })
      return 'Xóa like tweet thành công'
    }
  }
}

const likeService = new LikeService()
export default likeService
