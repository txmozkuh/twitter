import { ErrorCode, TokenType, UserVerifyStatus } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import RefreshToken from '@/models/schemas/refreshToken.schema'
import User, { UserType } from '@/models/schemas/user.schema'
import databaseService from '@/services/database.services'
import { LoginRequest, RegisterRequest } from '@/types/request'
import { hashPassword } from '@/utils/crypto'
import WrappedError from '@/utils/error'
import { signToken } from '@/utils/jwt'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
class UserService {
  private signValidateToken(user_id: string, token_type: TokenType, expiresIn?: number) {
    return signToken({
      payload: {
        user_id,
        token_type
      },
      privateKey: process.env.JWT_PRIVATE_KEY!,
      options: {
        expiresIn: expiresIn || 1800 //15m
      }
    })
  }

  private async signAuthToken(user_id: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.signValidateToken(user_id, TokenType.AccessToken, Number(process.env.ACCESS_TOKEN_EXPIRE_TIME)),
      this.signValidateToken(user_id, TokenType.RefreshToken, Number(process.env.REFRESH_TOKEN_EXPIRE_TIME))
    ])
    return {
      access_token,
      refresh_token
    }
  }

  verifyToken(token: string) {
    try {
      const decode = verify(token, process.env.JWT_PRIVATE_KEY!)
      return decode
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw { custom_error: new WrappedError(401, 'Token hết hạn sử dụng', ErrorCode.TokenError) }
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
    const _id = new ObjectId()
    const email_verify_token = await this.signValidateToken(_id.toString(), TokenType.EmailVerifyToken)
    const { name, email, password, date_of_birth } = payload
    const hash_password = hashPassword(password)
    await (
      await databaseService.getCollection('users')
    ).insertOne(new User({ _id, name, email, password: hash_password, date_of_birth, email_verify_token }))
    return { email_verify_token }
  }

  async login(payload: LoginRequest) {
    const { email, password } = payload

    const result = (await (
      await databaseService.getCollection('users')
    ).findOne({ email, password })) as UserType | null

    if (result) {
      const user_id = result._id!.toString()
      const verify_status = result.verify
      const verify_token = result.email_verify_token
      if (verify_token && verify_status === UserVerifyStatus.Unverified) {
        throw new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Người dùng chưa xác thực')
      }
      const { access_token, refresh_token } = await this.signAuthToken(user_id)
      this.saveRefreshToken(refresh_token, new ObjectId(user_id))
      const {
        _id,
        password,
        twitter_circle,
        created_at,
        updated_at,
        email_verify_token,
        forgot_password_token,
        verify,
        ...userInfo
      } = result as UserType
      return { ...userInfo, access_token, refresh_token }
    } else {
      throw new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Email hoặc tài khoản không đúng')
    }
  }

  async logout(user_id: ObjectId) {
    await (
      await databaseService.getCollection('refresh_tokens')
    ).deleteOne({
      user_id
    })
  }

  async refreshToken(user_id: string) {
    const { access_token, refresh_token } = await this.signAuthToken(user_id)
    this.saveRefreshToken(refresh_token, new ObjectId(user_id))
    return { access_token, refresh_token }
  }

  async createForgotPasswordToken(user_id: string) {
    const forgot_password_token = await this.signValidateToken(user_id, TokenType.ForgotPasswordToken)
    return forgot_password_token
  }
}

const userService = new UserService()
export default userService
