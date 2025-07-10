import httpService from '@/config/http'
import { API_URL, SuccessData } from '@/types/api'
import { TweetDetailResponse, NewfeedResponse } from '@/types/response'
// import { GetTweetDetailResponse, GetTweetsResponse } from '@/types/response'

export const getNewfeed = async (): Promise<SuccessData<NewfeedResponse[]>> => {
  return await httpService.get(API_URL.TWEET.GET_NEWFEED)
}

export const getTweetDetail = async (_id: string): Promise<SuccessData<TweetDetailResponse>> => {
  return await httpService.get(API_URL.TWEET.GET_TWEET_DETAIL + '/' + _id)
}
