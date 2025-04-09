import httpService from '@/config/http'
import { API_URL, SuccessData, SuccessWithoutData } from '@/types/api'
import {
  ForgetPasswordFormType,
  LoginFormType,
  RefreshTokenRequest,
  RegisterFormType,
  ResetPasswordFormType
} from '@/types/auth'
import { LoginResponse, RefreshTokenResponse, RegisterResponse } from '@/types/response'

export const login = async (data: LoginFormType): Promise<SuccessData<LoginResponse>> => {
  return await httpService.post(API_URL.AUTH.LOGIN, data)
}

export const register = async (data: RegisterFormType): Promise<SuccessData<RegisterResponse>> => {
  return await httpService.post(API_URL.AUTH.REGISTER, data)
}

export const requestResetPassword = async (data: ForgetPasswordFormType): Promise<SuccessWithoutData> => {
  return await httpService.post(API_URL.AUTH.FORGET_PASSWORD, data)
}

export const resetPassword = async (data: ResetPasswordFormType): Promise<SuccessWithoutData> => {
  return await httpService.post(API_URL.AUTH.RESET_PASSWORD, data)
}

export const refreshToken = async (data: RefreshTokenRequest): Promise<SuccessData<RefreshTokenResponse>> => {
  return await httpService.post(API_URL.AUTH.REFRESH_TOKEN, data)
}
