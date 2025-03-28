import { TokenType } from '@/constants/enums'
import { JwtPayload } from 'jsonwebtoken'
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
  success: boolean
  message: string
  data: T
}
export interface ErrorResponse {
  success: boolean
  message: string
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface UserIdAddedRequest extends Request {
  user_id?: string
}
