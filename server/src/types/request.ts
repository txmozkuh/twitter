import { TweetAudience, TweetType } from '@/constants/enums'
import { Media } from '@/models/schemas/media'
import { Request } from 'express'

export interface CustomRequest extends Request {
  user_id?: string
  access_token?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: Date
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TweetRequest {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc, không thì là tweet_id cha dạng string
  hashtags: string[] // tên của hashtag dạng ['javascript', 'reactjs']
  mentions: string[] // user_id[]
  medias: Media[]
}

export interface BookmarkRequest {
  tweet_id: string
}
