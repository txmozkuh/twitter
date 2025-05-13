import { env } from '@/config/env'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import Bookmark from '@/models/schemas/bookmark.schema'
import databaseService from '@/services/database.services'
import { SuccessData } from '@/types/response'
import WrappedError from '@/utils/error'
import { ObjectId } from 'mongodb'

class BookmarkService {
  async createBookmark(tweet_id: ObjectId, user_id: ObjectId) {
    const cll = await databaseService.getCollection(env.BOOKMARKS_COLLECTION || 'bookmarks')
    const bookmark = await cll.findOne({ tweet_id })

    if (bookmark) {
      throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet này đã được bookmark')
    } else {
      await cll.insertOne(new Bookmark({ tweet_id, user_id }))
      return 'Bookmark tweet thành công'
    }
  }

  async deleteBookmark(tweet_id: ObjectId) {
    const cll = await databaseService.getCollection(env.BOOKMARKS_COLLECTION || 'bookmarks')
    const bookmark = await cll.findOne({ tweet_id })
    if (!bookmark) throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet này chưa được bookmark')
    else {
      await cll.deleteOne({ _id: bookmark._id })
      return 'Xóa Bookmark tweet thành công'
    }
  }
}

const bookmarkservice = new BookmarkService()
export default bookmarkservice
