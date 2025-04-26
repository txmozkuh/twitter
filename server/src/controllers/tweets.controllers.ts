import { HTTP_STATUS } from '@/constants/httpStatusCode'
import tweetService from '@/services/tweets.services'
import { CustomRequest } from '@/types/request'
import { SuccessWithoutData } from '@/types/response'
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
