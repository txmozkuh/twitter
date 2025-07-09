import httpService from '@/config/http'
import { API_URL, SuccessData } from '@/types/api'
// import { GetTweetDetailResponse, GetTweetsResponse } from '@/types/response'

export const getTweets = async (): Promise<SuccessData<unknown>> => {
  return await httpService.get(API_URL.TWEET.GET_TWEETS)
}

export const getTweetDetail = async (_id: string): Promise<SuccessData<unknown>> => {
  return await httpService.get(API_URL.TWEET.GET_TWEET_DETAIL, { data: { _id } })
}
