import { TokenType } from '@/constants/enums'
import RefreshToken from '@/models/schemas/refreshToken.schema'
import User, { UserType } from '@/models/schemas/user.schema'
import databaseService from '@/services/database.services'
import { RegisterRequest, LoginRequest } from '@/types/auth.types'
import { hashPassword } from '@/utils/crypto'
import WrappedError from '@/utils/error'
import { signToken } from '@/utils/jwt'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
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

  private async signAuthToken(user_id: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }

  verifyAccessToken(access_token: string) {
    try {
      const decode = verify(access_token, process.env.JWT_PRIVATE_KEY!)
      return decode
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw { custom_error: new WrappedError(401, 'Token hết hạn sử dụng') }
      } else {
        throw { custom_error: new WrappedError(401, 'Lỗi xác thực token') }
      }
    }
  }

  private async saveRefreshToken(refresh_token: string, user_id: ObjectId) {
    try {
      const collection = await databaseService.getCollection('refresh_tokens')
      const existing_token = await collection.findOne({ user_id })
      if (existing_token) {
        collection.updateOne({ user_id }, { $set: { token: refresh_token } })
      } else {
        collection.insertOne(new RefreshToken({ token: refresh_token, user_id }))
      }
    } catch (error) {
      throw new WrappedError(500, 'Không lưu được refresh token')
    }
  }
  async register(payload: RegisterRequest) {
    const { name, email, password, date_of_birth } = payload
    const hash_password = hashPassword(password)
    const result = await (
      await databaseService.getCollection('users')
    ).insertOne(new User({ name, email, password: hash_password, date_of_birth }))
    const user_id = result.insertedId.toString()
    const { access_token, refresh_token } = await this.signAuthToken(user_id)
    this.saveRefreshToken(refresh_token, new ObjectId(user_id))
    return { access_token, refresh_token }
  }

  async login(payload: LoginRequest) {
    const { email, password } = payload

    const result = await (await databaseService.getCollection('users')).findOne({ email, password })

    if (result) {
      const user_id = result!._id.toString()
      const { access_token, refresh_token } = await this.signAuthToken(user_id)
      this.saveRefreshToken(refresh_token, new ObjectId(user_id))
      const { name, email, date_of_birth, avatar, cover_photo } = result as UserType
      return { user_id, name, email, date_of_birth, avatar, cover_photo, access_token, refresh_token }
    }
    return false
  }

  async logout(user_id: ObjectId) {
    try {
      await (
        await databaseService.getCollection('refresh_tokens')
      ).deleteOne({
        user_id
      })
    } catch (error) {
      throw new Error('Lỗi')
    }
  }

  async checkUserExist(email: string) {
    const user = await (
      await databaseService.getCollection('users')
    ).findOne({
      email
    })
    if (user) {
      return true
    }
    return false
  }
}

const userService = new UserService()
export default userService
