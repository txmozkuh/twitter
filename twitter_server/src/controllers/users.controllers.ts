import { NextFunction, Request, Response } from 'express'
import User from '@/models/schemas/user.schema'
import userService from '@/services/users.services'
import { hashPassword } from '@/utils/crypto'
import { TokenPayload, UserIdAddedRequest } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import {
  LoginResponse,
  refreshTokenResponse,
  RegisterResponse,
  SuccessData,
  SuccessWithoutData
} from '@/types/response'
import { RegisterRequest } from '@/types/request'

export const loginController = async (req: Request, res: Response<SuccessData<LoginResponse>>, next: NextFunction) => {
  const { email, password } = req.body
  try {
    const user = await userService.login({ email, password: hashPassword(password) })
    if (!user) {
      return next(new WrappedError(401, 'Email hoặc mật khẩu không đúng'))
    }
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        ...user,
        access_token: `Bearer ${user.access_token}`,
        refresh_token: `Bearer ${user.refresh_token}`
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const registerController = async (
  req: Request<object, object, RegisterRequest>,
  res: Response<SuccessData<RegisterResponse>>,
  next: NextFunction
) => {
  try {
    const { name, email, password, date_of_birth } = req.body
    const user = new User({ name, email, password, date_of_birth })

    const { email_verify_token } = await userService.register(user as RegisterRequest)
    //TODO:Gửi email với email_verify_token nhận được ở trên
    res.status(200).json({
      success: true,
      message: 'Đăng ký người dùng thành công. Vui lòng xác thực email trước khi bắt đầu',
      data: {
        name,
        email,
        date_of_birth
      }
    })
    return
  } catch (error) {
    return next(error)
  }
}

export const logoutController = async (
  req: UserIdAddedRequest,
  res: Response<SuccessWithoutData>,
  next: NextFunction
) => {
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

export const refreshTokenController = async (
  req: Request,
  res: Response<SuccessData<refreshTokenResponse>>,
  next: NextFunction
) => {
  try {
    const { refresh_token } = req.body
    const token = refresh_token.split(' ')[1]
    const result = await (await databaseService.getCollection('refresh_tokens')).findOne({ token })
    const { refresh_token: new_refresh_token, access_token } = await userService.refreshToken(
      result!.user_id.toString()
    )
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

export const verifyTokenController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  const { email_verify_token } = req.body
  try {
    const decode_token = userService.verifyToken(email_verify_token) as TokenPayload
    const result = await (
      await databaseService.getCollection('users')
    ).findOneAndUpdate(
      {
        _id: new ObjectId(decode_token.user_id),
        email_verify_token
      },
      {
        $set: {
          email_verify_token: '',
          updated_at: new Date()
        }
      }
    )
    if (!result) throw new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token xác thực không tồn tại hoặc hết hạn')
    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Xác thực email thành công' })
  } catch (error) {
    next(error)
  }
}
export const forgotPasswordController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  const { email } = req.body
  try {
    const db = await databaseService.getCollection('users')
    const user = await db.findOne({ email })
    const forgot_password_token = await userService.createForgotPasswordToken(user!._id.toString())
    db.updateOne(
      { email },
      {
        $set: {
          forgot_password_token,
          updated_at: new Date()
        }
      }
    )
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: 'Gửi yêu cầu reset mật khẩu thành công!\n Kiểm tra email của bạn' })
  } catch (error) {
    next(error)
  }
}
export const resetPasswordController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  const { new_password, forgot_password_token } = req.body
  const hass_password = hashPassword(new_password)
  try {
    await (
      await databaseService.getCollection('users')
    ).updateOne(
      { forgot_password_token },
      {
        $set: {
          password: hass_password,
          forgot_password_token: '',
          updated_at: new Date()
        }
      }
    )
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cập nhật mật khẩu thành công'
    })
  } catch (error) {
    next(error)
  }
}
