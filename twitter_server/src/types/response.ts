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
  user_id: string
  name: string
  email: string
  date_of_birth: Date
  avatar: string | undefined
  cover_photo: string | undefined
  access_token: string
  refresh_token: string
}

export interface refreshTokenResponse {
  refresh_token: string
  access_token: string
}
