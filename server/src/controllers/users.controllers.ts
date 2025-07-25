import { NextFunction, Request, RequestHandler, Response } from 'express'
import User, { UserType } from '@/models/schemas/user.schema'
import userService from '@/services/users.services'
import { hashPassword } from '@/utils/crypto'
import { TokenPayload, UserIdAddedRequest } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import {
  GetProfileResponse,
  LoginResponse,
  refreshTokenResponse,
  RegisterResponse,
  SuccessData,
  SuccessWithoutData,
  UpdateProfileResponse,
  UploadImageResponse
} from '@/types/response'
import { CustomRequest, RegisterRequest } from '@/types/request'
import { ErrorCode, LoginFrom, TokenType, UserVerifyStatus } from '@/constants/enums'
import mediaService from '@/services/medias.services'
import { getPublicId } from '@/utils/file'
import { env } from '@/config/env'
import { sendReclaimPasswordEmail, sendVerifyEmail } from '@/utils/email'

//flow : google oauth -> check user -> existed -> login -> tra ve token
//                                  -> khong existed -> register -> tra ve token
export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const google_user = req.user as UserType
    const user = await userService.login({ email: google_user.email, password: '123' }, LoginFrom.GoogleLogin)
    // const token = generateToken(user._id)
    // Redirect to frontend with token
    // res.redirect(`${env.CLIENT_URL}/auth/success?token=${user.access_token}}`)
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
    res.redirect(`${env.CLIENT_URL}/auth/error`)
    console.log(error)
  }
}

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

    sendVerifyEmail(
      email,
      '[X] - Verify your email',
      name,
      `http://localhost:3000/users/verify-email?email_verify_token=${email_verify_token}`
    )

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
  const { email_verify_token } = req.query
  try {
    const decode_token = userService.verifyToken(email_verify_token as string) as TokenPayload
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
          verify: UserVerifyStatus.Verified,
          updated_at: new Date()
        }
      }
    )
    if (!result)
      throw new WrappedError(
        HTTP_STATUS.UNAUTHORIZED,
        'Token xác thực không tồn tại hoặc hết hạn',
        ErrorCode.TokenError
      )
    res.redirect(env.CLIENT_URL)
  } catch (error) {
    next(error)
  }
}

export const forgotPasswordTokenController = async (
  req: Request,
  res: Response<SuccessWithoutData>,
  next: NextFunction
) => {
  const { forgot_password_token } = req.query
  try {
    const decode_token = userService.verifyToken(forgot_password_token as string) as TokenPayload
    const result = await (
      await databaseService.getCollection('users')
    ).findOne({
      _id: new ObjectId(decode_token.user_id),
      forgot_password_token
    })
    if (!result)
      throw new WrappedError(
        HTTP_STATUS.UNAUTHORIZED,
        'Token xác thực không tồn tại hoặc hết hạn',
        ErrorCode.TokenError
      )
    res.redirect('Redirect trang reset password: ' + forgot_password_token)
  } catch (error) {
    next(error)
  }
}
export const forgotPasswordController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  const { email } = req.body
  try {
    const db = await databaseService.getCollection('users')
    const user = await db.findOne<User>({ email })
    const forgot_password_token = await userService.createForgotPasswordToken(user!._id!.toString())
    const reclaim_url = `https://clientUrl/forgot-password?forgot-password-token=${forgot_password_token}`
    await sendReclaimPasswordEmail(email, user!.name!, reclaim_url)
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
      .json({ success: true, message: 'Gửi yêu cầu reset mật khẩu thành công! Kiểm tra email của bạn' })
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

export const getProfileController: RequestHandler = async (
  req: CustomRequest,
  res: Response<SuccessData<GetProfileResponse>>,
  next: NextFunction
) => {
  const user_id = (req as CustomRequest).user_id
  try {
    const user =
      ((await (await databaseService.getCollection('users')).findOne({ _id: new ObjectId(user_id) })) as UserType) ||
      null
    if (!user) {
      throw new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ')
    }
    const follows = await (
      await databaseService.getCollection(env.FOLLOWERS_COLLECTION)
    )
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id)
          }
        }
      ])
      .toArray()
    const followers = await (
      await databaseService.getCollection(env.FOLLOWERS_COLLECTION)
    )
      .aggregate([
        {
          $match: {
            follow_user_id: new ObjectId(user_id)
          }
        }
      ])
      .toArray()
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin thành công',
      data: {
        _id: user._id!.toString(),
        name: user.name,
        email: user.email,
        date_of_birth: user.date_of_birth,
        bio: user.bio,
        location: user.location,
        website: user.website,
        username: user.username,
        avatar: user.avatar,
        cover_photo: user.cover_photo,
        follows: follows.length,
        followers: followers.length
      }
    })
    return
  } catch (error) {
    next(error)
  }
}

export const updateProfileController = async (
  req: CustomRequest,
  res: Response<SuccessData<UpdateProfileResponse>>,
  next: NextFunction
) => {
  const user_id = req.user_id
  const updateData = req.body
  const filteredData = Object.fromEntries(Object.entries(updateData).filter(([, value]) => value !== undefined))
  try {
    ;(await databaseService.getCollection('users')).updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: filteredData,
        $currentDate: {
          updated_at: true
        }
      }
    )
    const userData =
      ((await (await databaseService.getCollection('users')).findOne({ _id: new ObjectId(user_id) })) as UserType) ||
      null
    res.status(200).json({
      message: 'Cập nhật thành công',
      success: true,
      data: {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        date_of_birth: userData.date_of_birth,
        bio: userData.bio,
        location: userData.location,
        website: userData.website,
        avatar: userData.avatar,
        cover_photo: userData.cover_photo
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updateAvatarController = async (
  req: CustomRequest,
  res: Response<SuccessData<UploadImageResponse>>,
  next: NextFunction
) => {
  try {
    const user_id = req.user_id
    const user = (await (
      await databaseService.getCollection('users')
    ).findOne({ _id: new ObjectId(user_id) })) as UserType

    const imageUrl = await mediaService.handleUploadImage(req, {
      folder: 'avatar',
      transformation: {
        width: 400,
        height: 400,
        crop: 'crop',
        gravity: 'center'
      }
    })
    if (!imageUrl) {
      return next(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Thay đổi ảnh không thành công'))
    }
    if (user.avatar) {
      const publicId = getPublicId(user.avatar)
      await mediaService.handleDeleteImage(publicId)
    }
    await (
      await databaseService.getCollection('users')
    ).updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          avatar: imageUrl,
          updated_at: new Date()
        }
      }
    )
    res.status(200).json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        url: imageUrl
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const updateCoverPhotoController = async (
  req: CustomRequest,
  res: Response<SuccessData<UploadImageResponse>>,
  next: NextFunction
) => {
  try {
    const user_id = req.user_id
    const user = (await (
      await databaseService.getCollection('users')
    ).findOne({ _id: new ObjectId(user_id) })) as UserType
    const imageUrl = await mediaService.handleUploadImage(req, {
      folder: 'cover_photo'
    })
    if (!imageUrl) {
      return next(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Thay đổi ảnh bìa thất bại'))
    }
    if (user.cover_photo) {
      const publicId = getPublicId(user.cover_photo)
      await mediaService.handleDeleteImage(publicId)
    }
    await (
      await databaseService.getCollection('users')
    ).updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          cover_photo: imageUrl,
          updated_at: new Date()
        }
      }
    )
    res.status(200).json({
      success: true,
      message: 'Cập nhật ảnh bìa thành công',
      data: {
        url: imageUrl
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteCoverPhotoController = async (
  req: CustomRequest,
  res: Response<SuccessWithoutData>,
  next: NextFunction
) => {
  const user_id = req.user_id as string
  const empty_cover_photo = 'https://res.cloudinary.com/dv3chhljd/image/upload/v1745553023/black_ucs01a.jpg'
  try {
    const cur_cover_photo = (
      (await (
        await databaseService.getCollection('users')
      ).findOne({
        _id: new ObjectId(user_id)
      })) as UserType
    ).cover_photo

    if (cur_cover_photo === empty_cover_photo) {
      return next(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Bạn hiện không có ảnh bìa!'))
    }
    const publicId = getPublicId(cur_cover_photo!)
    await mediaService.handleDeleteImage(publicId)

    await (
      await databaseService.getCollection('users')
    ).updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          cover_photo: empty_cover_photo,
          updated_at: new Date()
        }
      }
    )
    res.status(200).json({
      success: true,
      message: 'Xóa ảnh bìa thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const followUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user_id = req.user_id
  const { follow_user_id } = req.body
  try {
    await userService.follow(new ObjectId(user_id), new ObjectId(follow_user_id as string))
    res.json({
      message: 'Follow người dùng thành công '
    })
  } catch (error) {
    next(error)
  }
}
export const unFollowUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user_id = req.user_id
  const { unfollow_user_id } = req.body
  try {
    await userService.unFollow(new ObjectId(user_id), new ObjectId(unfollow_user_id as string))
    res.json({
      message: 'Unfollow người dùng thành công '
    })
  } catch (error) {
    next(error)
  }
}
