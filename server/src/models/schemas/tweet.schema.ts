import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '@/constants/enums'
import { Media } from '@/models/schemas/media'

interface TweetConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  views: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    audience,
    content,
    hashtags,
    medias,
    mentions,
    parent_id,
    type,
    user_id,
    views,
    created_at,
    updated_at
  }: TweetConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.hashtags = hashtags
    this.mentions = mentions.map((item) => new ObjectId(item))
    this.medias = medias
    this.views = views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
