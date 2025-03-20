import { TokenType } from '@/constants/enums'
import User from '@/models/schemas/user.schema'
import databaseService from '@/services/database.services'
import { RegisterRequest, LoginRequest } from '@/types/auth.types'
import { signToken } from '@/utils/jwt'

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_PRIVATE_KEY!,
      options: {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME) || 900 //15m
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_PRIVATE_KEY!,
      options: {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME) || 259200 //3 days
      }
    })
  }

  async register(payload: RegisterRequest) {
    const { name, email, password, date_of_birth } = payload
    const result = await (
      await databaseService.getCollection('users')
    ).insertOne(new User({ name, email, password, date_of_birth }))

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return { access_token, refresh_token }
  }

  async login(payload: LoginRequest) {
    return
  }
  async checkUserExist(email: string) {
    const user = await (
      await databaseService.getCollection('users')
    ).findOne({
      email
    })
    if (user) {
      throw new Error('User already exists')
    }
    return false
  }
}

const userService = new UserService()
export default userService
