import userService from '@/services/users.services'
import { ApiResponse } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult, checkSchema } from 'express-validator'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  console.log('Validating Login...')
  const { email, password } = req.body
  if (!email || !password) {
    return next(new WrappedError(400, 'Thiếu dữ liệu đăng nhập'))
  }
  next()
}

export const registerValidator = checkSchema({
  name: {
    in: ['body'],
    escape: true,
    trim: true,
    isString: { errorMessage: 'Name must be a string' },
    notEmpty: { errorMessage: 'Username is required' },
    isLength: {
      errorMessage: 'Username length must be between 3 and 20 characters',
      options: { min: 3, max: 20 }
    },
    matches: {
      options: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Username must only contain letters, numbers'
    }
  },
  email: {
    in: ['body'],
    escape: true,
    trim: true,
    isString: { errorMessage: 'Email must be a string' },
    notEmpty: { errorMessage: 'Email is required' },
    isLength: {
      errorMessage: 'Email length must be between 3 and 50 characters',
      options: { min: 3, max: 50 }
    },
    isEmail: { errorMessage: 'Invalid email format' },
    custom: {
      options: async (value) => {
        const user = await userService.checkUserExist(value)
        if (user) {
          throw new Error('User already exists')
        }
        return false
      }
    }
  },
  password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Password must be a string' },
    notEmpty: { errorMessage: 'Password is required' },
    isLength: {
      errorMessage: 'Password must be at least 6 characters long',
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
      errorMessage:
        'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }
  },
  confirm_password: {
    in: ['body'],
    trim: true,
    isString: { errorMessage: 'Confirm password must be a string' },
    notEmpty: { errorMessage: 'Confirm password is required' },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password')
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
      errorMessage: 'Invalid date ISO8601 format'
    },
    toDate: true
  }
})

export const validateRequest: RequestHandler = (
  req: Request,
  res: Response<ApiResponse<Error>>,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Lỗi', error: errors.array().toString() })
    return
  }
  next()
}
