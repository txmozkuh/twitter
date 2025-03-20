import { Request } from 'express'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: Date
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SuccessResponse<T> {
  message: string
  data: T
}
export interface ErrorResponse {
  error: string
  message: string
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
