import { NextFunction, Request, Response } from 'express'
import User from '@/models/schemas/user.schema'
import userService from '@/services/users.services'
import { hashPassword } from '@/utils/crypto'
import { ApiResponse, RegisterRequest, UserIdAddedRequest } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import RefreshToken, { RefreshTokenType } from '@/models/schemas/refreshToken.schema'
import chalk from 'chalk'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    const user = await userService.login({ email, password: hashPassword(password) })
    if (!user) {
      return next(new WrappedError(401, 'Email hoặc mật khẩu không đúng'))
    }
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: { ...user, access_token: `Bearer ${user.access_token}`, refresh_token: `Bearer ${user.refresh_token}` }
    })
  } catch (error) {
    return next(error)
  }
}

export const registerController = async (
  req: Request<object, object, RegisterRequest>,
  res: Response<
    ApiResponse<{ name: string; email: string; date_of_birth: Date; access_token: string; refresh_token: string }>
  >,
  next: NextFunction
) => {
  try {
    const { name, email, password, date_of_birth } = req.body
    const user = new User({ name, email, password, date_of_birth })

    const { access_token, refresh_token } = await userService.register(user as RegisterRequest)
    res.status(200).json({
      success: true,
      message: 'Đăng ký người dùng thành công',
      data: {
        name,
        email,
        date_of_birth,
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`
      }
    })
    return
  } catch (error) {
    return next(error)
  }
}

export const logoutController = async (req: UserIdAddedRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req
    userService.logout(new ObjectId(user_id))
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' })
    return
  } catch (error) {
    next(error)
    return
  }
}

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = req.body
    const token = refresh_token.split(' ')[1]
    const result = await (await databaseService.getCollection('refresh_tokens')).findOne({ token })
    const { refresh_token: new_refresh_token, access_token } = await userService.refreshToken(
      result!.user_id.toString()
    )
    console.log('Token cũ: ', refresh_token)
    console.log('Token mới: ', {
      refresh_token: new_refresh_token,
      access_token
    })
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Reset token thành công',
      data: {
        refresh_token: new_refresh_token,
        access_token
      }
    })
  } catch (error) {
    next(error)
    return
  }
}
