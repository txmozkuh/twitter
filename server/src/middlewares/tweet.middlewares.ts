import { env } from '@/config/env'
import { ErrorCode, MediaType, TweetAudience, TweetType, UserVerifyStatus } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import { Media } from '@/models/schemas/media'
import Tweet from '@/models/schemas/tweet.schema'
import databaseService from '@/services/database.services'
import userService from '@/services/users.services'
import WrappedError from '@/utils/error'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { ParseParams } from 'zod'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '@/models/schemas/user.schema'

export const createTweetValidator = checkSchema({
  type: {
    in: 'body',
    custom: {
      options: (value) => {
        const arr = Object.entries(TweetType)
        const typeListValue = arr.slice(arr.length / 2).map((item) => item[1])
        if (!(value in typeListValue)) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Sai định dạng kiểu tweet') }
        }
        return true
      }
    }
  },
  audience: {
    in: 'body',
    custom: {
      options: (value) => {
        const arr = Object.entries(TweetAudience)
        const typeListValue = arr.slice(arr.length / 2).map((item) => item[1])
        if (!(value in typeListValue)) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Sai định dạng kiểu audience') }
        }
        return true
      }
    }
  },
  parent_id: {
    in: 'body',
    custom: {
      options: (value, { req }) => {
        const type = req.body.type as TweetType
        if ([TweetType.QuoteTweet, TweetType.Retweet, TweetType.Comment].includes(type) && !ObjectId.isValid(value)) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Parent_id phải là tweet_id hợp lệ') }
        }
        if (type === TweetType.Tweet && value !== null) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Parent_id phải là null') }
        }
        return true
      }
    }
  },
  content: {
    in: 'body',
    isString: { errorMessage: 'Content phải là chuỗi' },
    custom: {
      options: (value, { req }) => {
        const type = req.body.type as TweetType
        const hashtags = req.body.hashtags as string[]
        const mentions = req.body.mentions as string[]

        if (
          [TweetType.QuoteTweet, TweetType.Tweet, TweetType.Comment].includes(type) &&
          isEmpty(hashtags) &&
          isEmpty(mentions) &&
          value === ''
        ) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Content không được để trống') }
        }
        if (type === TweetType.Retweet && value !== '') {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Content phải là string rỗng') }
        }
        return true
      }
    }
  },
  hashtags: {
    in: 'body',
    isArray: { errorMessage: 'Hashtags phải là một array' },
    custom: {
      options: (value) => {
        if (value.some((item: any) => typeof item !== 'string' || item.length === 0)) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Hashtags phải gồm các chuỗi không rỗng') }
        }
        return true
      }
    }
  },
  mentions: {
    in: 'body',
    isArray: {
      errorMessage: 'Mentions phải là một array'
    },
    custom: {
      options: (value) => {
        if (!value.every((item: any) => ObjectId.isValid(item))) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Mentions phải có các user_id hợp lệ') }
        }
        return true
      }
    }
  },
  medias: {
    in: 'body',
    isArray: { errorMessage: 'Medias phải là array' },
    custom: {
      options: (value: Media[]) => {
        const arr = Object.entries(MediaType)
        const mediaTypes = arr.slice(arr.length / 2).map((item) => item[1])
        if (
          value.some((item: Media) => {
            return typeof item.url !== 'string' && !mediaTypes.includes(item.type)
          })
        ) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Media phải chứa các media Object') }
        }
        return true
      }
    }
  }
})

export const getTweetDetailValidator = checkSchema({
  tweet_id: {
    in: 'params',
    custom: {
      options: async (value: string, { req }) => {
        if (!ObjectId.isValid(value))
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id sai định dạng') }
        const result = await (
          await databaseService.getCollection<Tweet>(env.TWEETS_COLLECTION)
        ).findOne({ _id: new ObjectId(value) })
        if (!result) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id không tồn tại') }
        }
        req.tweet = result
        return true
      }
    }
  }
})

export const getTweetChildrenValidator = checkSchema({
  tweet_id: {
    in: 'params',
    custom: {
      options: async (value: string, { req }) => {
        if (!ObjectId.isValid(value)) {
          throw {
            custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet id sai định dạng', ErrorCode.TweetInvalid)
          }
        }
        const result = await (
          await databaseService.getCollection(env.TWEETS_COLLECTION)
        ).findOne({
          _id: new ObjectId(value)
        })
        if (!result) {
          throw {
            custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet không tồn tại', ErrorCode.TweetInvalid)
          }
        }
        req.tweet = result
        return true
      }
    }
  }
})

export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = (req as any).user_id as string
  const tweet = (req as any).tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    const result = await (
      await databaseService.getCollection(env.USERS_COLLECTION)
    ).findOne<User>({
      _id: new ObjectId(tweet.user_id)
    })
    const valid = result!.twitter_circle!.some((id) => id.toString() === user_id)
    if (!valid || result?.verify === UserVerifyStatus.Banned) {
      throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Tweet này hiện không khả dụng với bạn', ErrorCode.TweetInvalid)
    }
  }
  next()
}
