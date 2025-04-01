import httpService from '@/config/http'
import { API_URL } from '@/types/api'
import { LoginFormType, RegisterFormType } from '@/types/auth'

export const login = async (data: LoginFormType) => {
  return await httpService.post(API_URL.AUTH.LOGIN, data)
}

export const register = async (data: RegisterFormType) => {
  return await httpService.post(API_URL.AUTH.REGISTER, data)
}
