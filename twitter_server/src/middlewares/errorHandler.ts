import { HTTP_STATUS } from '@/constants/httpStatusCode'
import { ErrorResponse } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { NextFunction, Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: WrappedError, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Internal server error'
  })
}
