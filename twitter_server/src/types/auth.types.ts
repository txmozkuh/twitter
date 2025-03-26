import { TokenType } from '@/constants/enums'
import { JwtPayload } from 'jsonwebtoken'

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

export interface AccessTokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
