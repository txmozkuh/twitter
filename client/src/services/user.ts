import httpService from '@/config/http'
import { API_URL, SuccessData } from '@/types/api'
import { GetProfileResponse, UpdateProfileResponse } from '@/types/response'
import { UpdateFormType } from '@/types/user'

export const getProfile = async (): Promise<SuccessData<GetProfileResponse>> => {
  return await httpService.get(API_URL.USER.GET_PROFILE)
}

export const updateProfile = async (data: UpdateFormType): Promise<SuccessData<UpdateProfileResponse>> => {
  return await httpService.patch(API_URL.USER.UPDATE_PROFILE, data)
}
