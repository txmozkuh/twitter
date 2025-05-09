import { HTTP_STATUS } from '@/constants/httpStatusCode'
import Tweet from '@/models/schemas/tweet.schema'
import databaseService from '@/services/database.services'
import tweetService from '@/services/tweets.services'
import { CustomRequest } from '@/types/request'
import { SuccessData, SuccessWithoutData } from '@/types/response'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

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

export const getTweetController = async (req: CustomRequest, res: Response<SuccessData<Tweet>>, next: NextFunction) => {
  const user_id = req.user_id
  const { tweet_id } = req.params
  const result = (await (
    await databaseService.getCollection(process.env.TWEETS_COLLECTION || 'tweets')
  ).findOne({ _id: new ObjectId(tweet_id as string) })) as Tweet
  res.json({
    success: true,
    message: 'Lấy detail tweet thành công',
    data: result
  })
  return
}
