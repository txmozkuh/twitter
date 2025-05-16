import Hashtag from '@/models/schemas/hashtag.schema'
import Tweet from '@/models/schemas/tweet.schema'
import databaseService from '@/services/database.services'
import { TweetRequest } from '@/types/request'
import { ObjectId } from 'mongodb'

class TweetService {
  async createTweet(payload: TweetRequest, user_id: ObjectId) {
    const result = await this.checkHashtags(payload.hashtags)
    await (
      await databaseService.getCollection('tweets')
    ).insertOne(
      new Tweet({
        user_id,
        type: payload.type,
        audience: payload.audience,
        content: payload.content,
        hashtags: result,
        mentions: payload.mentions,
        medias: payload.medias,
        parent_id: payload.parent_id
      })
    )
    return payload
  }

  async checkHashtags(hashtags: string[]) {
    const collection = await databaseService.getCollection('hashtags')
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        return collection.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((item) => item!._id)
  }
}

const tweetService = new TweetService()
export default tweetService
