import { TokenType } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import databaseService from '@/services/database.services'
import userService from '@/services/users.services'
import { ApiResponse, TokenPayload } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

export const loginValidator = checkSchema(
  {
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
  },
  ['body']
)

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
        const user = await userService.checkUserExist(value)
        if (user) {
          throw { custom_error: new WrappedError(409, 'Email đã tồn tại') }
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
          throw new Error('Mật khẩu xác nhận không khớp')
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
      errorMessage: { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Không tìm thấy token') }
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    exists: { errorMessage: { custom_error: new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Không tìm thấy token') } },
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
            throw { custom_error: new WrappedError(HTTP_STATUS.UNAUTHORIZED, 'Không tìm thấy token') }
          }
        } catch (error) {
          throw { custom_error: new WrappedError(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Token không tồn tại ') }
        }
        return true
      }
    }
  }
})

export const validateRequest: RequestHandler = (
  req: Request,
  res: Response<ApiResponse<Error>>,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const first_error = errors.array()[0]
    if (typeof first_error.msg === 'string' && first_error.type === 'field') {
      return next(new WrappedError(HTTP_STATUS.UNPROCESSABLE_ENTITY, first_error.msg))
    } else {
      if ('custom_error' in first_error.msg) {
        return next(first_error.msg.custom_error)
      }
    }
  }

  next()
}
