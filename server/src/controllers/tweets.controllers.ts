import { SortOrder } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import Tweet from '@/models/schemas/tweet.schema'
import databaseService from '@/services/database.services'
import tweetService from '@/services/tweets.services'
import { CustomRequest } from '@/types/request'
import { FilterDataList, SuccessData, SuccessWithoutData, TweetResponse } from '@/types/response'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { env } from '@config/env'

export const createTweetController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user_id = req.user_id
  const result = tweetService.createTweet(req.body, new ObjectId(user_id))
  res.json({
    success: true,
    message: 'Tạo tweet thành công',
    data: {
      result
    }
  })
  return
}

export const getTweetController = async (
  req: CustomRequest,
  res: Response<SuccessData<TweetResponse>>,
  next: NextFunction
) => {
  const user_id = req.user_id
  const { tweet_id } = req.params
  //updateView
  await (
    await databaseService.getCollection(env.TWEETS_COLLECTION || 'tweets')
  ).findOneAndUpdate(
    { _id: new ObjectId(tweet_id as string) },
    {
      $inc: { views: 1 }
    }
  )

  const result = (await (
    await databaseService.getCollection(env.TWEETS_COLLECTION)
  )
    .aggregate([
      {
        $match: {
          _id: new ObjectId(tweet_id)
        }
      },
      {
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'tweet_id',
          as: 'bookmarks_info'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'tweet_id',
          as: 'likes_info'
        }
      },
      {
        $addFields: {
          bookmark_amount: { $size: '$bookmarks_info' },
          like_amount: { $size: '$likes_info' }
        }
      },
      {
        $project: {
          bookmarks_info: 0,
          likes_info: 0
        }
      }
    ])
    .toArray()) as TweetResponse[]
  const data = result[0]

  res.json({
    success: true,
    message: 'Lấy detail tweet thành công',
    data
  })
  return
}

export const getTweetListController = async (
  req: CustomRequest,
  res: Response<SuccessData<FilterDataList<TweetResponse>>>,
  next: NextFunction
) => {
  const user_id = req.user_id
  const collection = await databaseService.getCollection(env.TWEETS_COLLECTION)
  const post_ids = (await collection.find().limit(5).toArray()).map((item) => item._id)
  await collection.updateMany(
    {
      _id: { $in: post_ids }
    },
    {
      $inc: { views: 1 }
    }
  )

  const result = (await (
    await databaseService.getCollection(env.TWEETS_COLLECTION || 'tweets')
  )
    .aggregate(
      [
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks_info'
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes_info'
          }
        },
        {
          $addFields: {
            bookmark_amount: {
              $size: '$bookmarks_info'
            },
            like_amount: {
              $size: '$likes_info'
            }
          }
        },
        {
          $project: {
            bookmarks_info: 0,
            likes_info: 0
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'owner',
            pipeline: [
              {
                $project: {
                  twitter_circle: 1,
                  _id: 0
                }
              }
            ]
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
                    audience: 1
                  },
                  {
                    'owner.twitter_circle': new ObjectId(user_id)
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
        },
        {
          $limit: 5
        }
      ],
      {
        maxTimeMS: 60000,
        allowDiskUse: true
      }
    )
    .toArray()) as TweetResponse[]

  res.json({
    success: true,
    message: 'Lấy detail tweet thành công',
    data: {
      page: 1,
      item_per_page: 5,
      total: 5,
      sort_order: SortOrder.Asc,
      sort_by: '',
      data: result
    }
  })
  return
}

export const getTweetChildrenController = async (
  req: CustomRequest,
  res: Response<SuccessData<Tweet> | SuccessWithoutData>,
  next: NextFunction
) => {
  const { tweet_id } = req.params
  const child_tweet = await (
    await databaseService.getCollection(env.TWEETS_COLLECTION)
  ).findOne<Tweet>({ parent_id: new ObjectId(tweet_id) })

  if (child_tweet === null) {
    res.json({
      success: true,
      message: 'Tweet này không có tweet children'
    })
    return
  }
  res.json({
    success: true,
    message: 'Lấy children tweet thành công',
    data: child_tweet
  })
  return
}
