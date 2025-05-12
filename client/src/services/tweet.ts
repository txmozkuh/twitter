import httpService from '@/config/http'
import { API_URL, SuccessData } from '@/types/api'
import { GetTweetDetailResponse, GetTweetsResponse } from '@/types/response'

export const getTweets = async (): Promise<SuccessData<GetTweetsResponse>> => {
  return await httpService.get(API_URL.TWEET.GET_TWEETS)
}

export const getTweetDetail = async (_id: string): Promise<SuccessData<GetTweetDetailResponse>> => {
  return await httpService.get(API_URL.TWEET.GET_TWEET_DETAIL, { data: { _id } })
}
