import { env } from '@/config/env'
import { SortOrder } from '@/constants/enums'
import Hashtag from '@/models/schemas/hashtag.schema'
import Tweet from '@/models/schemas/tweet.schema'
import databaseService from '@/services/database.services'
import { TweetRequest } from '@/types/request'
import { deleteEmptyObject } from '@/utils/others'
import { ObjectId, Sort } from 'mongodb'
import { PipelineStage } from 'mongoose'

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

  private async increaseView(tweets: Tweet[]) {
    const cll = await databaseService.getCollection(env.TWEETS_COLLECTION)
    const tweet_ids = tweets.map((item) => new ObjectId(item._id))
    await cll.updateMany(
      {
        _id: { $in: tweet_ids }
      },
      {
        $inc: { views: 1 }
      }
    )
  }

  private getFollowerTweets(user_id: ObjectId): PipelineStage[] {
    return [
      {
        $match: {
          user_id
        }
      },
      {
        $lookup: {
          from: 'tweets',
          localField: 'followed_user_id',
          foreignField: 'user_id',
          as: 'follower_tweets'
        }
      },
      {
        $unwind: {
          path: '$follower_tweets',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          user_id: 0,
          followed_user_id: 0,
          created_at: 0
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$follower_tweets', '$$ROOT']
          }
        }
      },
      {
        $project: {
          follower_tweets: 0
        }
      }
    ]
  }

  private getComment(parent_id: ObjectId) {
    //Nếu
  }
  private getParentTweet(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'tweets',
          localField: 'parent_id',
          foreignField: '_id',
          as: 'parent_tweet'
        }
      },
      {
        $set: {
          parent_tweet: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: '$parent_tweet'
                  },
                  0
                ]
              },
              then: '$$REMOVE',
              else: '$parent_tweet'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$parent_tweet',
          preserveNullAndEmptyArrays: true
        }
      }
    ]
  }

  private filterAudience(user_id: ObjectId): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            {
              audience: 0
            },
            {
              $and: [
                {
                  audience: 1,
                  'owner.twitter_circle': user_id
                }
              ]
            }
          ]
        }
      },
      {
        $project: {
          owner: 0
        }
      }
    ]
  }

  private sort(order: SortOrder = SortOrder.Asc): PipelineStage.Sort {
    return { $sort: { created_at: order } }
  }

  async getNewfeed(user_id: ObjectId) {
    const data = await (await databaseService.getCollection(env.FOLLOWERS_COLLECTION))
      .aggregate([...this.getFollowerTweets(user_id), ...this.filterAudience(user_id), ...this.getParentTweet()])
      .toArray()
    const result = deleteEmptyObject(data)

    this.increaseView(result) //update view in database
    result.forEach((item) => item.views++) //increase view in aggregation result to make it consistency

    return result
  }

  async getComments() {
    //có type là COMMENT
  }
}

const tweetService = new TweetService()
export default tweetService
