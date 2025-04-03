import { TokenType } from '@/constants/enums'
import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface UserIdAddedRequest extends Request {
  user_id?: string
}
