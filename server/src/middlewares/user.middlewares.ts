import { env } from '@/config/env'
import { ErrorCode, TokenType } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import User from '@/models/schemas/user.schema'
import databaseService from '@/services/database.services'
import userService from '@/services/users.services'
import { TokenPayload } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

export const loginValidator = checkSchema({
  email: {
    in: ['body'],
    escape: true,
    trim: true,
    isString: { errorMessage: 'Email phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Email không được để trống' },
    isLength: {
      errorMessage: 'Email phải có từ 3-20 kí tự',
      options: { min: 3, max: 50 }
    },
    isEmail: { errorMessage: 'Sai định dạng email' }
  },
  password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Mật khẩu phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Yêu cầu nhập mật khẩu' },
    isLength: {
      errorMessage: 'Mật khẩu phải có ít nhất 6 kí tự',
      options: { min: 6 }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'Mật khẩu cần có ít nhất một chữ cái thường, một chữ cái in hoa, 1 số và 1 ký tự đặc biệt'
    }
  }
})

export const registerValidator = checkSchema({
  name: {
    in: ['body'],
    escape: true,
    trim: true,
    notEmpty: { errorMessage: 'Tên không được để trống' },
    isString: { errorMessage: 'Tên phải là chuỗi kí tự' },
    isLength: {
      errorMessage: 'Username phải có từ 3-20 kí tự',
      options: { min: 3, max: 20 }
    },
    matches: {
      options: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Username chỉ được chứa chữ cái và số'
    }
  },
  email: {
    in: ['body'],
    escape: true,
    trim: true,
    isString: { errorMessage: 'Email phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Email không được để trống' },
    isLength: {
      errorMessage: 'Email phải có từ 3-20 kí tự',
      options: { min: 3, max: 50 }
    },
    isEmail: { errorMessage: 'Sai định dạng email' },
    custom: {
      options: async (value) => {
        const user = await (await databaseService.getCollection('users')).findOne({ email: value })
        if (user) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Email đã tồn tại') }
        }
        return true
      }
    }
  },
  password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Mật khẩu phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Yêu cầu nhập mật khẩu' },
    isLength: {
      errorMessage: 'Mật khẩu phải có ít nhất 6 kí tự',
      options: { min: 6 }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'Mật khẩu cần có ít nhất một chữ cái thường, một chữ cái in hoa, 1 số và 1 ký tự đặc biệt'
    }
  },
  confirm_password: {
    in: ['body'],

    trim: true,
    isString: { errorMessage: 'Mật khẩu xác nhận phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Yêu cầu xác nhận lại mật khẩu' },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Mật khẩu xác nhận không khớp') }
        }
        return true
      }
    }
  },
  date_of_birth: {
    in: ['body'],
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true
      },
      errorMessage: 'Sai định dạng ngày'
    },
    toDate: true
  }
})
export const logoutValidator = checkSchema({
  Authorization: {
    in: ['headers'],
    exists: {
      errorMessage: { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token') }
    },
    isString: {
      errorMessage: 'Token phải là chuỗi'
    },
    custom: {
      options: async (value, { req }) => {
        if (value.startsWith('Bearer')) {
          const token = value.split(' ')[1]
          const decode_token = userService.verifyToken(token) as TokenPayload
          try {
            if (decode_token.token_type !== TokenType.AccessToken) {
              throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ') }
            }
            const db = await databaseService.getCollection('refresh_tokens')
            const result = await db.findOne({ user_id: new ObjectId(decode_token.user_id) })
            if (!result) {
              throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token') }
            }
            req.user_id = decode_token.user_id
          } catch (error) {
            throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ') }
          }
        } else {
          throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token sai định dạng') }
        }
        return true
      }
    }
  }
})

export const refreshTokenValidator = checkSchema({
  refresh_token: {
    in: ['body'],
    exists: { errorMessage: { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token') } },
    custom: {
      options: async (value) => {
        const token = value.split(' ')[1]
        const decode_token = userService.verifyToken(token) as TokenPayload
        try {
          if (decode_token.token_type !== TokenType.RefreshToken) {
            throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ') }
          }
          const db = await databaseService.getCollection('refresh_tokens')
          const result = await db.findOne({ user_id: new ObjectId(decode_token.user_id), token })
          if (!result) {
            throw {
              custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token', ErrorCode.TokenError)
            }
          }
        } catch (error) {
          throw {
            custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không tồn tại ', ErrorCode.TokenError)
          }
        }
        return true
      }
    }
  }
})

export const verifyTokenValidator = checkSchema({
  email_verify_token: {
    in: 'query',
    isString: { errorMessage: 'Token phải là chuỗi' },
    custom: {
      options: (value) => {
        const token = userService.verifyToken(value) as TokenPayload
        if (token.token_type !== TokenType.EmailVerifyToken) {
          throw {
            custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token xác thực tài khoản không hợp lệ')
          }
        }
        return true
      }
    }
  }
})

export const forgotPasswordValidator = checkSchema({
  email: {
    in: ['body'],
    escape: true,
    trim: true,
    isString: { errorMessage: 'Email phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Email không được để trống' },
    isLength: {
      errorMessage: 'Email phải có từ 3-20 kí tự',
      options: { min: 3, max: 50 }
    },
    isEmail: { errorMessage: 'Sai định dạng email' },
    custom: {
      options: async (value) => {
        const result = await (await databaseService.getCollection('users')).findOne({ email: value })

        if (!result) throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Email người dùng không tồn tại') }

        return true
      }
    }
  }
})

export const resetPasswordValidator = checkSchema({
  new_password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Mật khẩu phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Yêu cầu nhập mật khẩu mới' },
    isLength: {
      errorMessage: 'Mật khẩu phải có ít nhất 6 kí tự',
      options: { min: 6 }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'Mật khẩu cần có ít nhất một chữ cái thường, một chữ cái in hoa, 1 số và 1 ký tự đặc biệt'
    }
  },
  confirm_new_password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Mật khẩu xác nhận phải là chuỗi kí tự' },
    notEmpty: { errorMessage: 'Yêu cầu xác nhận lại mật khẩu' },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.new_password) {
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Mật khẩu xác nhận không khớp') }
        }
        return true
      }
    }
  },
  forgot_password_token: {
    in: 'body',
    isString: { errorMessage: 'Token phải là chuỗi' },
    custom: {
      options: async (value) => {
        const result = await (await databaseService.getCollection('users')).findOne({ forgot_password_token: value })
        if (!result)
          throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không tồn tại hoặc hết hạn') }
        return true
      }
    }
  }
})

export const accessTokenValidator = checkSchema({
  Authorization: {
    in: ['headers'],
    exists: {
      errorMessage: { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token') }
    },
    custom: {
      options: async (val, { req }) => {
        const access_token = val.split(' ')[1]
        const decode = userService.verifyToken(access_token) as TokenPayload
        if (decode.token_type !== TokenType.AccessToken) {
          throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Token không hợp lệ') }
        }
        req.user_id = decode.user_id
        return true
      }
    }
  }
})

export const updateProfileValidator = checkSchema(
  {
    name: {
      optional: true,
      isString: { errorMessage: 'Tên người dùng phải là chuỗi' },
      isLength: {
        options: {
          min: 6,
          max: 20
        },
        errorMessage: 'Tên phải có độ dài 6-20 kí tự'
      }
    },
    username: {
      optional: true,

      isString: {
        errorMessage: 'Tên người dùng phải là chuỗi'
      },
      isLength: {
        options: {
          min: 6,
          max: 20
        },
        errorMessage: 'Tên đăng nhập phải có độ dài từ 6-20 ký tự'
      },
      matches: {
        options: [/^[a-zA-Z0-9_]+$/],
        errorMessage: 'Tên người dùng không được chứa khoảng trắng hoặc ký tự đặc biệt (chỉ chữ, số và gạch dưới)'
      }
    },
    date_of_birth: {
      in: ['body'],
      optional: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: 'Sai định dạng ngày'
      },
      toDate: true
    },
    bio: {
      optional: true,
      isString: {
        errorMessage: 'Tiểu sử phải là chuỗi'
      }
    },
    location: {
      optional: true,
      isString: {
        errorMessage: 'Địa điểm phải là chuỗi'
      }
    },
    website: {
      optional: true,
      isURL: {
        errorMessage: 'Website phải là một URL hợp lệ'
      }
    },
    _checkAtLeastOneField: {
      custom: {
        options: (value, { req }) => {
          const hasAnyField = ['name', 'date_of_birth', 'bio', 'location', 'website', 'username'].some(
            (field) => req.body[field] !== undefined
          )
          if (!hasAnyField) {
            throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Phải có ít nhất 1 trường ') }
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const followUserValidator = checkSchema({
  follow_user_id: {
    in: 'body',
    exists: { errorMessage: 'Không nhận được user_id' },
    custom: {
      options: async (value: string, { req }) => {
        const { user_id } = req
        if (!ObjectId.isValid(value))
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Id sai định dạng') }
        const user = await (
          await databaseService.getCollection(env.USERS_COLLECTION)
        ).findOne<User>({ _id: new ObjectId(value) })
        if (!user) throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'User không tồn tại') }
        const follow_state = await (
          await databaseService.getCollection(env.FOLLOWERS_COLLECTION)
        ).findOne({ user_id: new ObjectId(user_id as string), followed_user_id: new ObjectId(value) })
        if (follow_state)
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Bạn đã follow người dùng này') }
        return true
      }
    }
  }
})

export const unFollowUserValidator = checkSchema({
  unfollow_user_id: {
    in: 'body',
    exists: { errorMessage: 'Không nhận được user_id' },
    custom: {
      options: async (value: string, { req }) => {
        const { user_id } = req
        if (!ObjectId.isValid(value))
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Id sai định dạng') }
        const user = await (
          await databaseService.getCollection(env.USERS_COLLECTION)
        ).findOne<User>({ _id: new ObjectId(value) })
        if (!user) throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'User không tồn tại') }
        const follow_state = await (
          await databaseService.getCollection(env.FOLLOWERS_COLLECTION)
        ).findOne({ user_id: new ObjectId(user_id as string), followed_user_id: new ObjectId(value) })
        if (!follow_state)
          throw { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Bạn hiện không follow người dùng này') }
        return true
      }
    }
  }
})

export const validateRequest: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const first_error = errors.array()[0]
    if (typeof first_error.msg === 'string' && first_error.type === 'field') {
      return next(new WrappedError(HTTP_STATUS.BAD_REQUEST, first_error.msg))
    } else {
      if ('custom_error' in first_error.msg) {
        return next(first_error.msg.custom_error)
      }
    }
  }

  next()
}
