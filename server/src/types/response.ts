import { SortOrder } from '@/constants/enums'
import Tweet from '@/models/schemas/tweet.schema'
import { ObjectId } from 'mongodb'

export interface ErrorData {
  success: false
  message: string
  statusCode: number
  error: string
  timestamp: string
}

export interface SuccessData<T> {
  success: true
  message: string
  data: T
}
export interface SuccessWithoutData {
  success: true
  message: string
}

export interface RegisterResponse {
  name: string
  email: string
  date_of_birth: Date
}

export interface LoginResponse {
  name: string
  email: string
  date_of_birth: Date
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  access_token: string
  refresh_token: string
}

export interface UpdateProfileResponse {
  name: string
  email: string
  date_of_birth: Date
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface refreshTokenResponse {
  refresh_token: string
  access_token: string
}

export interface GetProfileResponse {
  _id: string
  name: string
  email: string
  date_of_birth: Date
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  follows: number
  followers: number
}

export interface UploadImageResponse {
  url: string
}

export interface FilterDataList<T> {
  total: number
  page: number
  item_per_page: number
  sort_by: string
  sort_order: SortOrder
  data: T[]
}

export interface TweetResponse extends Tweet {
  like_amount: number
  bookmark_amount: number
}

export interface ChatListResponse {
  latestMessage: {
    content: string
    timestamp: string
  }
  user_info: {
    name: string
    username: string
    avatar: string
  }
}
