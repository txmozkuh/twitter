export const API_URL = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    FORGET_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password'
  }
} as const

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
