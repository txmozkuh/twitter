import httpService from '@/config/http'
import { API_URL, SuccessData, SuccessWithoutData } from '@/types/api'
import { GetProfileResponse, UpdateProfileResponse } from '@/types/response'
import { UpdateFormType } from '@/types/user'

export const getProfile = async (): Promise<SuccessData<GetProfileResponse>> => {
  return await httpService.get(API_URL.USER.GET_PROFILE)
}

export const updateProfile = async (data: UpdateFormType): Promise<SuccessData<UpdateProfileResponse>> => {
  return await httpService.patch(API_URL.USER.UPDATE_PROFILE, data)
}

export const updateCoverPhoto = async (data: FormData): Promise<SuccessData<{ url: string }>> => {
  return await httpService.post(API_URL.USER.UPDATE_COVER_PHOTO, data)
}

export const updateAvatar = async (data: FormData): Promise<SuccessData<{ url: string }>> => {
  return await httpService.post(API_URL.USER.UPDATE_AVATAR, data)
}

export const deleteCoverPhoto = async (): Promise<SuccessWithoutData> => {
  return await httpService.patch(API_URL.USER.DELETE_COVER_PHOTO)
}
