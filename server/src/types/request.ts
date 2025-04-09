import { Request } from 'express'

export interface CustomRequest extends Request {
  user_id?: string
  access_token?: string
}

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
